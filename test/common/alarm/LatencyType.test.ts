import {LatencyType, getLatencyTypeExpressionId, getLatencyTypeLabel, getLatencyTypeStatistic} from "../../../lib";

test("latency type getters work for all enum values", () => {
    Object.values(LatencyType).forEach((latencyType) => {
        expect(getLatencyTypeStatistic(latencyType)).toBeTruthy();
        expect(getLatencyTypeExpressionId(latencyType)).toBeTruthy();
        expect(getLatencyTypeLabel(latencyType)).toBeTruthy();
    });
});
