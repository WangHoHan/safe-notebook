export class RegExUtils {
    constructor() {}

    static isPasswordValid(password: string): boolean {
        const passwordPattern: RegExp = /^.{20,}$/;
        return passwordPattern.test(password);
    };
}
