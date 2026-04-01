/** Dispatched after a project is created so the home grid refetches Firestore */
export const PROJECTS_UPDATED_EVENT = "portfolio:projects-updated";

export function notifyProjectsUpdated(): void {
  window.dispatchEvent(new CustomEvent(PROJECTS_UPDATED_EVENT));
}
