export class PixPayload {
    private key: string;
    private name: string;
    private city: string;
    private txid: string;
    private amount: number | null;

    constructor(key: string, name: string, city: string, txid: string, amount: number | null = null) {
        this.key = key;
        this.name = this.sanitize(name).substring(0, 25); // Max 25 chars recommended
        this.city = this.sanitize(city).substring(0, 15); // Max 15 chars recommended
        this.txid = this.sanitize(txid).substring(0, 25) || '***';
        this.amount = amount;
    }

    private sanitize(value: string): string {
        return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    }

    private formatField(id: string, value: string): string {
        const len = value.length.toString().padStart(2, '0');
        return `${id}${len}${value}`;
    }

    public generate(): string {
        let payload = "";

        // 00 - Payload Format Indicator
        payload += this.formatField("00", "01");

        // 26 - Merchant Account Information
        let gui = this.formatField("00", "br.gov.bcb.pix");
        let key = this.formatField("01", this.key);
        payload += this.formatField("26", gui + key);

        // 52 - Merchant Category Code
        payload += this.formatField("52", "0000");

        // 53 - Transaction Currency (986 = BRL)
        payload += this.formatField("53", "986");

        // 54 - Transaction Amount (Optional)
        if (this.amount && this.amount > 0) {
            payload += this.formatField("54", this.amount.toFixed(2));
        }

        // 58 - Country Code
        payload += this.formatField("58", "BR");

        // 59 - Merchant Name
        payload += this.formatField("59", this.name);

        // 60 - Merchant City
        payload += this.formatField("60", this.city);

        // 62 - Additional Data Field Template (TxID)
        let txidField = this.formatField("05", this.txid);
        payload += this.formatField("62", txidField);

        // 63 - CRC16
        payload += "6304";
        payload += this.getCRC16(payload);

        return payload;
    }

    private getCRC16(payload: string): string {
        let polynomial = 0x1021;
        let crc = 0xFFFF;

        for (let i = 0; i < payload.length; i++) {
            let c = payload.charCodeAt(i);
            crc ^= (c << 8);
            for (let j = 0; j < 8; j++) {
                if ((crc & 0x8000) !== 0) {
                    crc = (crc << 1) ^ polynomial;
                } else {
                    crc = (crc << 1);
                }
            }
        }

        return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    }
}
