import { addDays, daysBetween } from './calendarService';

/**
 * Calculates Gestational Age (GA) in days from Crown-Rump Length (CRL) in mm.
 * Uses a simplified linear approximation valid for 6-12 weeks.
 * Formula: GA (days) = CRL(mm) + 42
 * @param crl - Crown-Rump Length in millimeters.
 * @returns Gestational age in total days, or null if CRL is out of typical range.
 */
export const calculateGAfromCRL = (crl: number): number | null => {
    if (crl < 5 || crl > 84) return null; // Typical range for CRL dating (approx 6 to 14 weeks)
    return Math.round(crl + 42);
};

/**
 * Calculates Gestational Age (GA) in days from various biometric parameters (in mm).
 * Averages the GA from each available parameter using simplified formulas.
 * This is an estimation and not a substitute for validated multi-parameter formulas (e.g., Hadlock).
 * @param biometry - Object with BPD, HC, AC, FL measurements in mm.
 * @returns Gestational age in total days, or null if no valid parameters are provided.
 */
export const calculateGAfromBiometry = (biometry: { bpd?: number, hc?: number, ac?: number, fl?: number }): number | null => {
    const { bpd, hc, ac, fl } = biometry;
    const gaCalculations: number[] = [];

    // Simplified individual formulas (approximations)
    if (bpd && bpd > 20) gaCalculations.push((1.266 * bpd) + 64.14);
    if (hc && hc > 80) gaCalculations.push((0.762 * hc) + 66.86);
    if (ac && ac > 60) gaCalculations.push((0.793 * ac) + 70.01);
    if (fl && fl > 15) gaCalculations.push((2.396 * fl) + 65.65);

    if (gaCalculations.length === 0) return null;

    const averageGA = gaCalculations.reduce((sum, val) => sum + val, 0) / gaCalculations.length;
    return Math.round(averageGA);
};

export const calculateEDCfromLMP = (lmp: Date): Date => {
  return addDays(lmp, 280);
};

export const calculateEDCfromGA = (gaDays: number, scanDate: Date): Date => {
    const remainingDays = 280 - gaDays;
    return addDays(scanDate, remainingDays);
};

/**
 * Reconciles LMP and Ultrasound dating based on ACOG guidelines.
 * Returns keys for translation instead of hardcoded strings.
 * @param lmp - The patient's last menstrual period date.
 * @param ultrasound - Ultrasound data including GA in days and the date of the scan.
 * @returns An object with the final EDC, and keys for the method used and justification message.
 */
export const reconcileDates = (
    lmp: Date,
    ultrasound: { gaDays: number; scanDate: Date }
): { finalEDC: Date; methodKey: 'lmp' | 'ultrasound'; messageKey: string } => {

    const edcByLMP = calculateEDCfromLMP(lmp);
    const gaByLMPOnScanDate = daysBetween(lmp, ultrasound.scanDate);
    const edcByUS = calculateEDCfromGA(ultrasound.gaDays, ultrasound.scanDate);
    
    const discrepancy = Math.abs(gaByLMPOnScanDate - ultrasound.gaDays);

    let methodKey: 'lmp' | 'ultrasound' = 'lmp';
    let messageKey = 'reconcile_useLMP';

    // ACOG Guidelines for Redating, checked in order from latest GA to earliest.
    // GA by LMP on the date of the scan determines which rule to apply.

    // Third Trimester: >= 28w 0d (>= 196 days)
    if (gaByLMPOnScanDate >= 196 && discrepancy > 21) {
        methodKey = 'ultrasound';
        messageKey = 'reconcile_t3';
    }
    // Late Second Trimester: 22w 0d to 27w 6d (154 to 195 days)
    else if (gaByLMPOnScanDate >= 154 && discrepancy > 14) {
        methodKey = 'ultrasound';
        messageKey = 'reconcile_t2_late';
    }
    // Mid Second Trimester: 16w 0d to 21w 6d (112 to 153 days)
    else if (gaByLMPOnScanDate >= 112 && discrepancy > 10) {
        methodKey = 'ultrasound';
        messageKey = 'reconcile_t2_mid';
    }
    // Early Second Trimester: 14w 0d to 15w 6d (98 to 111 days)
    else if (gaByLMPOnScanDate >= 98 && discrepancy > 7) {
        methodKey = 'ultrasound';
        messageKey = 'reconcile_t2_early';
    }
    // Late First Trimester: 9w 0d to 13w 6d (63 to 97 days)
    else if (gaByLMPOnScanDate >= 63 && discrepancy > 7) {
        methodKey = 'ultrasound';
        messageKey = 'reconcile_t1_late';
    }
    // Early First Trimester: < 9w 0d (< 63 days)
    else if (gaByLMPOnScanDate < 63 && discrepancy > 5) {
        methodKey = 'ultrasound';
        messageKey = 'reconcile_t1_early';
    }

    return {
        finalEDC: methodKey === 'lmp' ? edcByLMP : edcByUS,
        methodKey,
        messageKey,
    };
};