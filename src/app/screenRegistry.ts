import type { ScreenId } from '@/utils/router'

export type ScreenRenderContext = {
  container: HTMLElement
}

export type ScreenModule = {
  id: ScreenId
  render: (ctx: ScreenRenderContext) => void | Promise<void>
  authRequired?: boolean
}

const registry = new Map<ScreenId, ScreenModule>()

export function registerScreen(module: ScreenModule): void {
  registry.set(module.id, module)
}

export function getScreenModule(id: ScreenId): ScreenModule | undefined {
  return registry.get(id)
}

export function getAllScreens(): ScreenModule[] {
  return Array.from(registry.values())
}
