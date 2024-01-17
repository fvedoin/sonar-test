export type dataToWriteInInflux = {
  measurement: 'payload';
  time: string;
  tags: {
    dev_id: string;
  };
  fields: {
    integer: {
      counter: number;
      port: number;
    };
    string: {
      dev_eui?: string;
    };
    float: {
      counter_fall?: number;
      counter_return?: number;
      energy_fall_time?: number;
      energy_return_time?: number;
      drc_phase_a?: number;
      drc_phase_b?: number;
      drc_phase_c?: number;
      drp_phase_a?: number;
      drp_phase_b?: number;
      drp_phase_c?: number;
      quality_interval_start?: number;
      quality_interval_end?: number;
      consumed_total_energy?: number;
      generated_total_energy?: number;
      capacitive_total_energy?: number;
      inductive_total_energy?: number;
      frequency?: number;
      current_phase_a?: number;
      current_phase_b?: number;
      current_phase_c?: number;
      relay_out?: number;
      active_power_phase_a?: number;
      active_power_phase_b?: number;
      active_power_phase_c?: number;
      power_factor_phase_a?: number;
      power_factor_phase_b?: number;
      power_factor_phase_c?: number;
      reative_power_phase_a?: number;
      reative_power_phase_b?: number;
      reative_power_phase_c?: number;
      apparent_power_phase_a?: number;
      apparent_power_phase_b?: number;
      apparent_power_phase_c?: number;
      voltage_phase_a?: number;
      voltage_phase_b?: number;
      voltage_phase_c?: number;
      cable_status?: number;
    };
  };
};
