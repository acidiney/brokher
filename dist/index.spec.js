"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-undef */
const _1 = require(".");
let contract;
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    contract = yield _1.setup('rabbit');
}));
describe('Brokher', () => {
    test('setup contract', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(contract).toBeDefined();
    }));
    test('createConnection need exist', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(contract.setConnection).toBeDefined();
    }));
    test('setExchange need exist', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(contract.setExchange).toBeDefined();
    }));
    test('setRoutingKey need exist', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(contract.setRoutingKey).toBeDefined();
    }));
    test('publish need exist', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(contract.publish).toBeDefined();
    }));
    test('subscribe need exist', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(contract.subscribe).toBeDefined();
    }));
    test('test chain pattern', () => __awaiter(void 0, void 0, void 0, function* () {
        expect(yield contract
            .setConnection({ uri: 'guest:guest@localhost:5672' })
            .setExchange('logs')
            .setChannel('topic', { durable: false })
            .setRoutingKey('normal')
            .publish({ message: 'ok' })).toBeTruthy();
    }));
});
