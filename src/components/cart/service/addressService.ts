// services/addressService.ts
export const getProvinces = async () => {
    const res = await fetch("https://provinces.open-api.vn/api/p/");
    const data = await res.json();
    return data.map((p: any) => ({ value: p.code, label: p.name }));
};

export const getDistricts = async (provinceCode: number) => {
    const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
    const data = await res.json();
    return data.districts.map((d: any) => ({ value: d.code, label: d.name }));
};

export const getWards = async (districtCode: number) => {
    const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
    const data = await res.json();
    return data.wards.map((w: any) => ({ value: w.code, label: w.name }));
};
