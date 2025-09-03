
export interface TransactionInterface {
    userId: string,
    transactionId: string,
    transactionType: number,
    amount: string,
    category: string,
    description: string,
    isDeleted: boolean
}