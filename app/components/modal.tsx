import { ModalProps } from "decl-modal";

interface MyFirstModalProps extends ModalProps {
  myCustomProp: any;
}

export const MyFirstModal: React.FC<MyFirstModalProps> = ({
  closeModal,
  RootProps,
}) => {
  return (
    <div
      className="flex fixed opacity-0 bg-black bg-opacity-70 top-0 bottom-0 w-full"
      onClick={() => closeModal(false)}
      {...RootProps}
    >
      <div className="m-auto">
        <div className="bg-white rounded-md p-5 font-bold">Hello world! :)</div>
      </div>
    </div>
  );
};
