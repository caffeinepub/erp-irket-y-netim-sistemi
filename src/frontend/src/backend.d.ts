import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Bilgi {
    id: string;
    rol: Rol;
    userId: Principal;
    aktifMi: boolean;
    yetkiler: Yetki;
    adSoyad: string;
    companyId: string;
}
export type Time = bigint;
export interface Yetki {
    personelYonetimi: boolean;
    duyuruYonetimi: boolean;
    raporGorme: boolean;
    gorevYonetimi: boolean;
}
export interface Bilgi__1 {
    id: string;
    oncelik: bigint;
    baslangicTarihi: Time;
    olusturanId: Principal;
    aciklama: string;
    bitisTarihi: Time;
    durum: Durum;
    sorumluId: Principal;
    companyId: string;
}
export interface Bilgi__2 {
    id: string;
    hedefRol?: CompanyRole;
    olusturmaTarihi: Time;
    icerik: string;
    olusturanId: Principal;
    companyId: string;
}
export interface UserProfile {
    permissions: ModulePermissions;
    active: boolean;
    name: string;
    role: CompanyRole;
    companyId: string;
}
export interface ModulePermissions {
    personnelAdd: boolean;
    announcementEdit: boolean;
    taskAdd: boolean;
    announcementView: boolean;
    taskEdit: boolean;
    personnelDelete: boolean;
    taskView: boolean;
    reportView: boolean;
    taskDelete: boolean;
    announcementDelete: boolean;
    personnelEdit: boolean;
    personnelView: boolean;
    announcementAdd: boolean;
}
export enum CompanyRole {
    Employee = "Employee",
    Owner = "Owner",
    Manager = "Manager"
}
export enum Durum {
    tamamlandi = "tamamlandi",
    devamEdiyor = "devamEdiyor",
    beklemede = "beklemede"
}
export enum Rol {
    calisan = "calisan",
    yonetici = "yonetici"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    aktifPersonelleriListele(): Promise<Array<Bilgi>>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    davetKoduKullan(kod: string, kullaniciAdi: string): Promise<boolean>;
    davetKoduOlustur(rol: CompanyRole, gecerlilikSuresi: Time): Promise<string>;
    duyuruKaydet(id: string, icerik: string, hedefRol: CompanyRole | null): Promise<boolean>;
    duyuruSil(id: string): Promise<boolean>;
    duyurulariListele(): Promise<Array<Bilgi__2>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    gorevGuncelle(id: string, aciklama: string, oncelik: bigint, durum: Durum): Promise<boolean>;
    gorevKaydet(id: string, aciklama: string, oncelik: bigint, sorumluId: Principal, baslangicTarihi: Time, bitisTarihi: Time, durum: Durum): Promise<boolean>;
    gorevSil(id: string): Promise<boolean>;
    gorevleriByDurum(durum: Durum): Promise<Array<Bilgi__1>>;
    gorevleriListele(): Promise<Array<Bilgi__1>>;
    isCallerAdmin(): Promise<boolean>;
    kurumKaydet(kurumId: string, kurumAdi: string): Promise<boolean>;
    kurumVarmi(id: string): Promise<boolean>;
    personelGetir(id: string): Promise<Bilgi>;
    personelGuncelle(id: string, adSoyad: string, rol: Rol, yetkiler: Yetki, aktifMi: boolean): Promise<boolean>;
    personelKaydet(id: string, adSoyad: string, rol: Rol, yetkiler: Yetki, userId: Principal): Promise<boolean>;
    personelListele(): Promise<Array<Bilgi>>;
    personelSil(id: string): Promise<boolean>;
    raporAl(raporTipi: string): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
