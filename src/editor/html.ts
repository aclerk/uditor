class Html {
  public focusNode(node: HTMLElement): void {
    node.focus();
    const redactor = node.parentNode;
    const block = node as HTMLElement;
    const children = redactor?.children;
    if (children) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        child.classList.remove('daily_editor_block_active');
      }
    }
    block?.classList.add('daily_editor_block_active');
    if (node.children != null && node.children.length > 0) {
      const son = node.children.item(0);
      if (son != null && son.children != null && son.children.length != null) {
        const grandson = son.children.item(0);
        if (grandson != null) {
          (grandson as HTMLElement).focus();
          if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
            const range = document.createRange();

            range.selectNodeContents(grandson);
            range.collapse(false);

            const sel = window.getSelection();
            if (sel !== null) {
              sel.removeAllRanges();
              sel.addRange(range);
            }
          }
        }
      }
    }
  }

  public getNodeFocused() {
    const selection = window.getSelection();

    if (selection != null && selection.anchorNode != null) {
      const node = selection.anchorNode as HTMLElement;
      return node.tagName ? node : selection.focusNode?.parentElement;
    } else {
      return null;
    }
  }
}

const html = new Html();
export default html;
