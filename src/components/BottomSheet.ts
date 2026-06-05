let activeSheet: HTMLElement | null = null
let activeBackdrop: HTMLElement | null = null

function sheetRoot(): HTMLElement {
  return document.getElementById('sheetRoot') ?? document.body
}

export function openBottomSheet(title: string, bodyHtml: string, footerHtml = ''): void {
  closeBottomSheet()

  const backdrop = document.createElement('div')
  backdrop.className = 'cm-sheet-backdrop'
  backdrop.addEventListener('click', () => closeBottomSheet())

  const sheet = document.createElement('div')
  sheet.className = 'cm-sheet'
  sheet.setAttribute('role', 'dialog')
  sheet.setAttribute('aria-modal', 'true')
  sheet.setAttribute('aria-label', title)
  sheet.innerHTML = `
    <div class="cm-sheet__handle" aria-hidden="true"></div>
    <h2 class="cm-sheet__title">${title}</h2>
    <div class="cm-sheet__body">${bodyHtml}</div>
    ${footerHtml ? `<div class="cm-sheet__actions">${footerHtml}</div>` : ''}`

  sheetRoot().append(backdrop, sheet)
  activeBackdrop = backdrop
  activeSheet = sheet

  requestAnimationFrame(() => {
    backdrop.classList.add('cm-sheet-backdrop--open')
    sheet.classList.add('cm-sheet--open')
  })
}

export function closeBottomSheet(): void {
  activeBackdrop?.remove()
  activeSheet?.remove()
  activeBackdrop = null
  activeSheet = null
}

export function isSheetOpen(): boolean {
  return activeSheet !== null
}
