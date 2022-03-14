export interface HashComparer {
    compare: (plaiText: string, cipherText: string) => Promise<boolean>;
}
