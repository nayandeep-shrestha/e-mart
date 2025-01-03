import { isEmpty, isFunction } from '.';

export default function clickDomNode<
  ElementType extends Element & { click: () => any },
>(selector: string) {
  const targetNodeWithClickEventListener: ElementType | null =
    document.querySelector(selector);

  if (isEmpty(targetNodeWithClickEventListener)) {
    console.warn(`ERR: ${selector} HTML Node Was Not Found in DOM Tree.`);
    return;
  }

  if (isFunction(targetNodeWithClickEventListener.click)) {
    targetNodeWithClickEventListener.click();
    return;
  }

  console.warn(`ERR: ${selector} HTML Node Does Not Contain Click Event.`);
}
