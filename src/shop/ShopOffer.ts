export class ShopOffer {
    public id: number;
    public offerType: number;
    public cost: number;      // 0 = Tamamen Bedava
    public multiplier: number;

    constructor(id: number, type: number, cost: number = 0) {
        this.id = id;
        this.offerType = type;
        this.cost = 0; // Hangi fiyat girilirse girilsin zorla 0 yapar
        this.multiplier = 1;
    }

    // Mega Kutu, Büyük Kutu ve Altın paketlerini bedava üreten fonksiyonlar
    public static getFreeMegaBox(id: number) {
        return new ShopOffer(id, 6, 0);
    }

    public static getFreeBigBox(id: number) {
        return new ShopOffer(id, 2, 0);
    }

    public static getFreeGems(id: number) {
        return new ShopOffer(id, 10, 0);
    }
}
 
