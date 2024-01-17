export default interface DataInfluxFindFaults {
    result: string;
    table: number;
    _time: string;
    dev_id: string;
    counter_fall: number;
    counter_return: number;
    energy_fall_time: number;
    energy_return_time: number;
}
