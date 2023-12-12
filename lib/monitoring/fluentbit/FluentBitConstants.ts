export enum FluentBitStorageMetricTag {
  TOTAL_CHUNKS = "total_chunks",
  MEM_CHUNKS = "mem_chunks",
  FS_CHUNKS = "fs_chunks",
  FS_CHUNKS_UP = "fs_chunks_up",
  FS_CHUNKS_DOWN = "fs_chunks_down",
}

export enum FluentBitOutputMetricTag {
  OUTPUT_RETRIES = "fluentbit_output_retries_total",
  OUTPUT_RETRIES_FAILED = "fluentbit_output_retries_failed_total",
  OUTPUT_ERRORS = "fluentbit_output_errors_total",
  OUTPUT_DROPPED_RECORDS = "fluentbit_output_dropped_records_total",
}

export enum FluentBitInputMetricTag {
  INPUT_RECORDS = "fluentbit_input_records_total",
}
export enum FluentBitFilterMetricTag {
  FILTER_EMIT_RECORDS = "fluentbit_filter_emit_records_total",
  FILTER_DROP_RECORDS = "fluentbit_filter_drop_records_total",
  FILTER_ADD_RECORDS = "fluentbit_filter_add_records_total",
}

export enum FluentBitMetricsWithoutWidget {
  INPUT_BYTES = "fluentbit_input_bytes_total",
  OUTPUT_PROC_RECORDS = "fluentbit_output_proc_records_total",
  OUTPUT_PROC_BYTES = "fluentbit_output_proc_bytes_total",
}
