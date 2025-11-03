import { createRoot, type Root } from 'react-dom/client';
import  { type DraggableModalProps,DraggableModal } from '.';

export type ImperativeShowProps = Omit<DraggableModalProps, 'open' | 'onClose'> & {
  onClose?: () => void;
};

interface ModalController {
  close: () => void;
  update: (nextProps: Partial<ImperativeShowProps>) => void;
}

const show = (props: ImperativeShowProps): ModalController => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root: Root = createRoot(container);

  let currentProps = props;

  const close = () => {
    try {
      root.unmount();
    } finally {
      if (container.parentNode) container.parentNode.removeChild(container);
      currentProps.onClose?.();
    }
  };

  const render = () => {
    root.render(
      <DraggableModal {...currentProps} open={true} onClose={close} />
    );
  };

  const update = (nextProps: Partial<ImperativeShowProps>) => {
    currentProps = { ...currentProps, ...nextProps };
    render();
  };

  render();

  return { close, update };
}

export const AIModal = { show };