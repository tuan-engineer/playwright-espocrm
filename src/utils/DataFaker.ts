import { randomUUID } from 'crypto';
import { fakerVI as faker } from '@faker-js/faker';
import { CONFIG } from "@cfg";

export class DataFaker {
    static getRandomNumber(min: number = 10, max: number = 100): number {
        return faker.number.int({ min, max });
    }
    static getRandomFloat(min: number = 1000, max: number = 100000): number {
        return faker.number.float({ min, max, fractionDigits: 2 });
    }
    static getUniqueId(): string {
        return faker.string.uuid();
    }
    static getCompanyName(): string {
        return faker.company.name();
    }
    static getFullName(): string {
        return faker.person.fullName();
    }
    static getEmail(): string {
        return faker.internet.email().toLowerCase();
    }
    static getPhone(): string {
        return faker.phone.number();
    }
    static getCity(): string {
        return faker.location.city();
    }
    static getDescription(sentences: number = 2): string {
        return faker.lorem.sentences(sentences);
    }
    static getTestDes(): string {
        return `${CONFIG.ENV.TEST_KEY}[${randomUUID()}]`;
    }
    static getWebsite(): string {
        return faker.internet.url();
    }
    static getMySQLDateTime(): string {
        return faker.date.recent().toISOString().slice(0, 19).replace('T', ' ');
    }
    static getStreet(): string {
        return faker.location.street();
    }
    static getZipCode(): string {
        return faker.location.zipCode();
    }
    static getSalutation(): string {
        return faker.helpers.arrayElement(['Mr.', 'Ms.', 'Mrs.', 'Dr.']);
    }
}
