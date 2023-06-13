/**
 * Preferred way of rendering dashboard widgets.
 */
export enum DashboardRenderingPreference {
  /**
   * Create standard set of dashboards with interactive widgets only
   */
  INTERACTIVE_ONLY,

  /**
   * Create standard set of dashboards with bitmap widgets only
   */
  BITMAP_ONLY,

  /**
   * Create a two sets of dashboards: standard set (interactive) and a copy (bitmap)
   */
  INTERACTIVE_AND_BITMAP,
}
