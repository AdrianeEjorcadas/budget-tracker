export interface ReturnResponse<T> {
    statusCode: number,
    message: string,
    data: T
}
