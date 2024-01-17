export default interface DataInfluxFindQuality {
    result: string;
    table: number;
    _time: Date | string;
    dev_id: string;
    drc_phase_a: number;
    drc_phase_b: number;
    drc_phase_c: number;
    drp_phase_a: number;
    drp_phase_b: number;
    drp_phase_c: number;
    quality_interval_end: number;
    quality_interval_start: number;
}
