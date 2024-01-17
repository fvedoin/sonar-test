"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfluxRepository = void 0;
const influxdb_client_1 = require("@influxdata/influxdb-client");
const influxdb_client_apis_1 = require("@influxdata/influxdb-client-apis");
const common_1 = require("@nestjs/common");
let InfluxRepository = class InfluxRepository {
    async connection(url, token) {
        const influxClient = new influxdb_client_1.InfluxDB({
            url,
            token,
        });
        const ping = new influxdb_client_apis_1.PingAPI(influxClient);
        return ping
            .getPing()
            .then(() => {
            return influxClient;
        })
            .catch((error) => {
            throw new Error(error);
        });
    }
};
InfluxRepository = __decorate([
    (0, common_1.Injectable)()
], InfluxRepository);
exports.InfluxRepository = InfluxRepository;
//# sourceMappingURL=influx.repository.js.map