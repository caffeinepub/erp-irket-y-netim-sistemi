import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Option "mo:core/Option";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Company and Role Management Types
  public type CompanyRole = {
    #Owner;
    #Manager;
    #Employee;
  };

  public type ModulePermissions = {
    personnelView : Bool;
    personnelAdd : Bool;
    personnelEdit : Bool;
    personnelDelete : Bool;
    taskView : Bool;
    taskAdd : Bool;
    taskEdit : Bool;
    taskDelete : Bool;
    announcementView : Bool;
    announcementAdd : Bool;
    announcementEdit : Bool;
    announcementDelete : Bool;
    reportView : Bool;
  };

  public type UserProfile = {
    name : Text;
    companyId : Text;
    role : CompanyRole;
    permissions : ModulePermissions;
    active : Bool;
  };

  public type InviteCode = {
    code : Text;
    companyId : Text;
    role : CompanyRole;
    createdBy : Principal;
    createdAt : Time.Time;
    expiresAt : Time.Time;
    used : Bool;
  };

  public type Company = {
    id : Text;
    name : Text;
    ownerId : Principal;
    createdAt : Time.Time;
  };

  // Personnel Module Types
  module Personel {
    public type Rol = {
      #yonetici;
      #calisan;
    };

    public type Yetki = {
      personelYonetimi : Bool;
      gorevYonetimi : Bool;
      duyuruYonetimi : Bool;
      raporGorme : Bool;
    };

    public type Bilgi = {
      id : Text;
      companyId : Text;
      adSoyad : Text;
      rol : Rol;
      yetkiler : Yetki;
      aktifMi : Bool;
      userId : Principal;
    };
  };

  // Task Module Types
  module Gorev {
    public type Durum = {
      #beklemede;
      #devamEdiyor;
      #tamamlandi;
    };

    public type Bilgi = {
      id : Text;
      companyId : Text;
      aciklama : Text;
      oncelik : Nat;
      sorumluId : Principal;
      baslangicTarihi : Time.Time;
      bitisTarihi : Time.Time;
      durum : Durum;
      olusturanId : Principal;
    };
  };

  // Announcement Module Types
  module Duyuru {
    public type Bilgi = {
      id : Text;
      companyId : Text;
      icerik : Text;
      olusturanId : Principal;
      hedefRol : ?CompanyRole;
      olusturmaTarihi : Time.Time;
    };

    public type OkunmaDurumu = {
      duyuruId : Text;
      userId : Principal;
      okundu : Bool;
      okunmaTarihi : ?Time.Time;
    };
  };

  // Data Storage
  let companies = Map.empty<Text, Company>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let inviteCodes = Map.empty<Text, InviteCode>();
  let personeller = Map.empty<Text, Personel.Bilgi>();
  let gorevler = Map.empty<Text, Gorev.Bilgi>();
  let duyurular = Map.empty<Text, Duyuru.Bilgi>();
  let duyuruOkunma = Map.empty<Text, Duyuru.OkunmaDurumu>();

  // Access Control Integration
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Helper Functions for Authorization
  private func getUserProfile_(caller : Principal) : ?UserProfile {
    userProfiles.get(caller);
  };

  private func requireProfile(caller : Principal) : UserProfile {
    switch (getUserProfile_(caller)) {
      case (null) { Runtime.trap("Unauthorized: User profile not found") };
      case (?profile) { profile };
    };
  };

  private func requireCompany(companyId : Text) : Company {
    switch (companies.get(companyId)) {
      case (null) { Runtime.trap("Company not found") };
      case (?company) { company };
    };
  };

  private func checkCompanyAccess(caller : Principal, companyId : Text) {
    let profile = requireProfile(caller);
    if (profile.companyId != companyId) {
      Runtime.trap("Unauthorized: Access denied to this company's data");
    };
  };

  private func checkRole(caller : Principal, allowedRoles : [CompanyRole]) {
    let profile = requireProfile(caller);
    let hasRole = allowedRoles.find(func(role) { role == profile.role });
    if (hasRole.isNull()) {
      Runtime.trap("Unauthorized: Insufficient role permissions");
    };
  };

  private func checkPermission(caller : Principal, check : (ModulePermissions) -> Bool) {
    let profile = requireProfile(caller);
    if (not profile.active) {
      Runtime.trap("Unauthorized: User account is inactive");
    };
    if (not check(profile.permissions)) {
      Runtime.trap("Unauthorized: Insufficient module permissions");
    };
  };

  private func getDefaultOwnerPermissions() : ModulePermissions {
    {
      personnelView = true;
      personnelAdd = true;
      personnelEdit = true;
      personnelDelete = true;
      taskView = true;
      taskAdd = true;
      taskEdit = true;
      taskDelete = true;
      announcementView = true;
      announcementAdd = true;
      announcementEdit = true;
      announcementDelete = true;
      reportView = true;
    };
  };

  private func getDefaultManagerPermissions() : ModulePermissions {
    {
      personnelView = true;
      personnelAdd = true;
      personnelEdit = true;
      personnelDelete = false;
      taskView = true;
      taskAdd = true;
      taskEdit = true;
      taskDelete = true;
      announcementView = true;
      announcementAdd = true;
      announcementEdit = false;
      announcementDelete = false;
      reportView = true;
    };
  };

  private func getDefaultEmployeePermissions() : ModulePermissions {
    {
      personnelView = false;
      personnelAdd = false;
      personnelEdit = false;
      personnelDelete = false;
      taskView = false;
      taskAdd = false;
      taskEdit = false;
      taskDelete = false;
      announcementView = false;
      announcementAdd = false;
      announcementEdit = false;
      announcementDelete = false;
      reportView = false;
    };
  };

  // User Profile Management (Required by Frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (caller.isAnonymous()) {
      return null;
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot view profiles");
    };

    let callerProfile = requireProfile(caller);

    // Can view own profile or if Owner/Manager in same company
    if (caller == user) {
      return userProfiles.get(user);
    };

    switch (userProfiles.get(user)) {
      case (null) { null };
      case (?targetProfile) {
        if (callerProfile.companyId != targetProfile.companyId) {
          Runtime.trap("Unauthorized: Cannot view profiles from other companies");
        };
        if (callerProfile.role != #Owner and callerProfile.role != #Manager) {
          Runtime.trap("Unauthorized: Only Owners and Managers can view other profiles");
        };
        ?targetProfile;
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot save profiles");
    };

    // Verify user can only update their own profile and cannot change critical fields
    let existingProfile = requireProfile(caller);
    if (existingProfile.companyId != profile.companyId) {
      Runtime.trap("Unauthorized: Cannot change company ID");
    };
    if (existingProfile.role != profile.role) {
      Runtime.trap("Unauthorized: Cannot change own role");
    };

    userProfiles.add(caller, profile);
  };

  // Company Registration
  public shared ({ caller }) func kurumKaydet(kurumId : Text, kurumAdi : Text) : async Bool {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot register companies");
    };

    if (companies.containsKey(kurumId)) {
      Runtime.trap("Company ID already exists");
    };

    // Check if user already belongs to a company
    switch (userProfiles.get(caller)) {
      case (?existing) {
        Runtime.trap("User already belongs to a company");
      };
      case (null) {};
    };

    let company : Company = {
      id = kurumId;
      name = kurumAdi;
      ownerId = caller;
      createdAt = Time.now();
    };

    let ownerProfile : UserProfile = {
      name = "";
      companyId = kurumId;
      role = #Owner;
      permissions = getDefaultOwnerPermissions();
      active = true;
    };

    companies.add(kurumId, company);
    userProfiles.add(caller, ownerProfile);

    true;
  };

  // Invite Code Management
  public shared ({ caller }) func davetKoduOlustur(rol : CompanyRole, gecerlilikSuresi : Time.Time) : async Text {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot create invite codes");
    };

    let profile = requireProfile(caller);

    // Only Owner can create Manager invites, Owner and Manager can create Employee invites
    switch (rol) {
      case (#Owner) { Runtime.trap("Cannot create Owner invite codes") };
      case (#Manager) {
        if (profile.role != #Owner) {
          Runtime.trap("Unauthorized: Only Owners can invite Managers");
        };
      };
      case (#Employee) {
        if (profile.role != #Owner and profile.role != #Manager) {
          Runtime.trap("Unauthorized: Only Owners and Managers can invite Employees");
        };
      };
    };

    let code = Time.now().toText();
    let invite : InviteCode = {
      code = code;
      companyId = profile.companyId;
      role = rol;
      createdBy = caller;
      createdAt = Time.now();
      expiresAt = Time.now() + gecerlilikSuresi;
      used = false;
    };

    inviteCodes.add(code, invite);
    code;
  };

  public shared ({ caller }) func davetKoduKullan(kod : Text, kullaniciAdi : Text) : async Bool {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot use invite codes");
    };

    // Check if user already has a profile
    switch (userProfiles.get(caller)) {
      case (?existing) {
        Runtime.trap("User already belongs to a company");
      };
      case (null) {};
    };

    let invite = switch (inviteCodes.get(kod)) {
      case (null) { Runtime.trap("Invalid invite code") };
      case (?inv) { inv };
    };

    if (invite.used) {
      Runtime.trap("Invite code already used");
    };

    if (Time.now() > invite.expiresAt) {
      Runtime.trap("Invite code expired");
    };

    let permissions = switch (invite.role) {
      case (#Owner) { getDefaultOwnerPermissions() };
      case (#Manager) { getDefaultManagerPermissions() };
      case (#Employee) { getDefaultEmployeePermissions() };
    };

    let newProfile : UserProfile = {
      name = kullaniciAdi;
      companyId = invite.companyId;
      role = invite.role;
      permissions = permissions;
      active = true;
    };

    userProfiles.add(caller, newProfile);

    let updatedInvite : InviteCode = {
      code = invite.code;
      companyId = invite.companyId;
      role = invite.role;
      createdBy = invite.createdBy;
      createdAt = invite.createdAt;
      expiresAt = invite.expiresAt;
      used = true;
    };
    inviteCodes.add(kod, updatedInvite);

    true;
  };

  // Personnel Management
  public shared ({ caller }) func personelKaydet(id : Text, adSoyad : Text, rol : Personel.Rol, yetkiler : Personel.Yetki, userId : Principal) : async Bool {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot add personnel");
    };

    let profile = requireProfile(caller);
    checkPermission(caller, func(p) { p.personnelAdd });

    if (personeller.containsKey(id)) {
      Runtime.trap("Bu ID ile kayıtlı bir eleman zaten var!");
    };

    let personel : Personel.Bilgi = {
      id = id;
      companyId = profile.companyId;
      adSoyad = adSoyad;
      rol = rol;
      yetkiler = yetkiler;
      aktifMi = true;
      userId = userId;
    };
    personeller.add(id, personel);
    true;
  };

  public shared query ({ caller }) func personelListele() : async [Personel.Bilgi] {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot view personnel");
    };

    let profile = requireProfile(caller);
    checkPermission(caller, func(p) { p.personnelView });

    let filtered = personeller.values().toArray().filter(
      func(p) { p.companyId == profile.companyId }
    );
    filtered;
  };

  public shared query ({ caller }) func personelGetir(id : Text) : async Personel.Bilgi {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot view personnel");
    };

    let profile = requireProfile(caller);
    checkPermission(caller, func(p) { p.personnelView });

    let personel = switch (personeller.get(id)) {
      case (null) { Runtime.trap("Personel bulunamadı") };
      case (?p) { p };
    };

    checkCompanyAccess(caller, personel.companyId);
    personel;
  };

  public shared ({ caller }) func personelGuncelle(id : Text, adSoyad : Text, rol : Personel.Rol, yetkiler : Personel.Yetki, aktifMi : Bool) : async Bool {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot update personnel");
    };

    let profile = requireProfile(caller);
    checkPermission(caller, func(p) { p.personnelEdit });

    let personel = switch (personeller.get(id)) {
      case (null) { Runtime.trap("Personel bulunamadı") };
      case (?p) { p };
    };

    checkCompanyAccess(caller, personel.companyId);

    let updated : Personel.Bilgi = {
      id = personel.id;
      companyId = personel.companyId;
      adSoyad = adSoyad;
      rol = rol;
      yetkiler = yetkiler;
      aktifMi = aktifMi;
      userId = personel.userId;
    };
    personeller.add(id, updated);
    true;
  };

  public shared ({ caller }) func personelSil(id : Text) : async Bool {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot delete personnel");
    };

    let profile = requireProfile(caller);
    checkPermission(caller, func(p) { p.personnelDelete });

    let personel = switch (personeller.get(id)) {
      case (null) { Runtime.trap("Personel bulunamadı") };
      case (?p) { p };
    };

    checkCompanyAccess(caller, personel.companyId);
    personeller.remove(id);
    true;
  };

  // Task Management
  public shared ({ caller }) func gorevKaydet(id : Text, aciklama : Text, oncelik : Nat, sorumluId : Principal, baslangicTarihi : Time.Time, bitisTarihi : Time.Time, durum : Gorev.Durum) : async Bool {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot create tasks");
    };

    let profile = requireProfile(caller);
    checkPermission(caller, func(p) { p.taskAdd });

    if (gorevler.containsKey(id)) {
      Runtime.trap("Bu ID ile görev zaten mevcut!");
    };

    let gorev : Gorev.Bilgi = {
      id = id;
      companyId = profile.companyId;
      aciklama = aciklama;
      oncelik = oncelik;
      sorumluId = sorumluId;
      baslangicTarihi = baslangicTarihi;
      bitisTarihi = bitisTarihi;
      durum = durum;
      olusturanId = caller;
    };
    gorevler.add(id, gorev);
    true;
  };

  public shared query ({ caller }) func gorevleriListele() : async [Gorev.Bilgi] {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot view tasks");
    };

    let profile = requireProfile(caller);
    checkPermission(caller, func(p) { p.taskView });

    let filtered = gorevler.values().toArray().filter(
      func(g) { g.companyId == profile.companyId }
    );
    filtered;
  };

  public shared ({ caller }) func gorevGuncelle(id : Text, aciklama : Text, oncelik : Nat, durum : Gorev.Durum) : async Bool {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot update tasks");
    };

    let profile = requireProfile(caller);
    checkPermission(caller, func(p) { p.taskEdit });

    let gorev = switch (gorevler.get(id)) {
      case (null) { Runtime.trap("Görev bulunamadı") };
      case (?g) { g };
    };

    checkCompanyAccess(caller, gorev.companyId);

    let updated : Gorev.Bilgi = {
      id = gorev.id;
      companyId = gorev.companyId;
      aciklama = aciklama;
      oncelik = oncelik;
      sorumluId = gorev.sorumluId;
      baslangicTarihi = gorev.baslangicTarihi;
      bitisTarihi = gorev.bitisTarihi;
      durum = durum;
      olusturanId = gorev.olusturanId;
    };
    gorevler.add(id, updated);
    true;
  };

  public shared ({ caller }) func gorevSil(id : Text) : async Bool {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot delete tasks");
    };

    let profile = requireProfile(caller);
    checkPermission(caller, func(p) { p.taskDelete });

    let gorev = switch (gorevler.get(id)) {
      case (null) { Runtime.trap("Görev bulunamadı") };
      case (?g) { g };
    };

    checkCompanyAccess(caller, gorev.companyId);
    gorevler.remove(id);
    true;
  };

  // Announcement Management
  public shared ({ caller }) func duyuruKaydet(id : Text, icerik : Text, hedefRol : ?CompanyRole) : async Bool {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot create announcements");
    };

    let profile = requireProfile(caller);
    checkPermission(caller, func(p) { p.announcementAdd });

    if (duyurular.containsKey(id)) {
      Runtime.trap("Bu ID ile duyuru zaten mevcut!");
    };

    let duyuru : Duyuru.Bilgi = {
      id = id;
      companyId = profile.companyId;
      icerik = icerik;
      olusturanId = caller;
      hedefRol = hedefRol;
      olusturmaTarihi = Time.now();
    };
    duyurular.add(id, duyuru);
    true;
  };

  public shared query ({ caller }) func duyurulariListele() : async [Duyuru.Bilgi] {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot view announcements");
    };

    let profile = requireProfile(caller);
    checkPermission(caller, func(p) { p.announcementView });

    let filtered = duyurular.values().toArray().filter(
      func(d) {
        if (d.companyId != profile.companyId) {
          return false;
        };
        switch (d.hedefRol) {
          case (null) { true };
          case (?rol) { rol == profile.role };
        };
      }
    );
    filtered;
  };

  public shared ({ caller }) func duyuruSil(id : Text) : async Bool {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot delete announcements");
    };

    let profile = requireProfile(caller);
    checkPermission(caller, func(p) { p.announcementDelete });

    let duyuru = switch (duyurular.get(id)) {
      case (null) { Runtime.trap("Duyuru bulunamadı") };
      case (?d) { d };
    };

    checkCompanyAccess(caller, duyuru.companyId);
    duyurular.remove(id);
    true;
  };

  // Reporting
  public shared query ({ caller }) func raporAl(raporTipi : Text) : async Text {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot view reports");
    };

    let profile = requireProfile(caller);
    checkPermission(caller, func(p) { p.reportView });

    // Return basic report structure - actual implementation would generate detailed reports
    "Rapor Tipi: " # raporTipi # " - Şirket: " # profile.companyId;
  };

  // Utility Functions
  public shared query ({ caller }) func kurumVarmi(id : Text) : async Bool {
    companies.containsKey(id);
  };

  public shared query ({ caller }) func aktifPersonelleriListele() : async [Personel.Bilgi] {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot view personnel");
    };

    let profile = requireProfile(caller);
    checkPermission(caller, func(p) { p.personnelView });

    let filtered = personeller.values().toArray().filter(
      func(p) { p.companyId == profile.companyId and p.aktifMi }
    );
    filtered;
  };

  public shared query ({ caller }) func gorevleriByDurum(durum : Gorev.Durum) : async [Gorev.Bilgi] {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous users cannot view tasks");
    };

    let profile = requireProfile(caller);
    checkPermission(caller, func(p) { p.taskView });

    let filtered = gorevler.values().toArray().filter(
      func(g) { g.companyId == profile.companyId and g.durum == durum }
    );
    filtered;
  };
};
