import { apiService } from './api';
import { API_ENDPOINTS } from 'src/config/api';
import { Alert, DeclineAlertRequest } from 'src/types/api';
import { logger } from 'src/utils/logger';

class AlertService {
  /**
   * Get all active alerts (PENDING status)
   */
  async getAlerts(status: 'PENDING' | 'ACKNOWLEDGED' | 'DONE' | 'EXPIRED' = 'PENDING'): Promise<Alert[]> {
    try {
      const alerts = await apiService.getBackendResponse<Alert[]>(
        `${API_ENDPOINTS.ALERTS}?status=${status}`
      );
      return alerts;
    } catch (error) {
      logger.error('Error fetching alerts', error);
      throw error;
    }
  }

  /**
   * Complete an alert (mark as DONE)
   * For SLAUGHTER_REMINDER alerts, provide list of slaughtered rabbit IDs
   */
  async completeAlert(alertId: number, slaughteredRabbitIds?: string[]): Promise<Alert> {
    try {
      const payload = slaughteredRabbitIds ? { slaughtered_rabbit_ids: slaughteredRabbitIds } : {};
      const alert = await apiService.postBackendResponse<Alert>(
        API_ENDPOINTS.ALERT_COMPLETE(alertId),
        payload
      );
      return alert;
    } catch (error) {
      logger.error('Error completing alert', error);
      throw error;
    }
  }

  /**
   * Get list of rabbits associated with a SLAUGHTER_REMINDER alert
   */
  async getAlertRabbits(alertId: number): Promise<import('src/types/api').AlertRabbit[]> {
    try {
      const rabbits = await apiService.getBackendResponse<import('src/types/api').AlertRabbit[]>(
        API_ENDPOINTS.ALERT_RABBITS(alertId)
      );
      return rabbits;
    } catch (error) {
      logger.error('Error fetching alert rabbits', error);
      throw error;
    }
  }

  /**
   * Decline an alert with a reason
   */
  async declineAlert(alertId: number, reason: string): Promise<Alert> {
    try {
      const data: DeclineAlertRequest = { reason };
      const alert = await apiService.postBackendResponse<Alert>(
        API_ENDPOINTS.ALERT_DECLINE(alertId),
        data
      );
      return alert;
    } catch (error) {
      logger.error('Error declining alert', error);
      throw error;
    }
  }
}

// Export singleton instance
export const alertService = new AlertService();
export default alertService;

