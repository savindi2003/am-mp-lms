import { ImSpinner2 } from "react-icons/im";
import { Button } from "@/modules/ui/button";

type ConfirmDeleteProps = {
  onCloseModal?: () => void;
  disabled?: boolean;
  onConfirm: (id?: number, id2?: number) => Promise<void>;
  resource: string;
  onAction?: () => Promise<void> | void;
};

function ConfirmDelete({
  onCloseModal,
  disabled,
  onConfirm,
  resource,
  onAction,
}: ConfirmDeleteProps) {
  return (
    <div>
      <h2 className="text-md font-semibold md:text-2xl text-slate-800">
        Delete {resource}
      </h2>
      <p className="my-5 flex w-xs items-center justify-center border-2 border-red-300 bg-red-200 p-2 pl-5 text-[12px] font-semibold text-destructive sm:my-10 sm:h-20 sm:w-auto sm:px-12 sm:text-sm">
        Are you sure you want to delete this {resource} permanently? This action
        cannot be undone.
      </p>

      <div className="flex w-full justify-end gap-3 px-7">
        <Button variant="secondary" onClick={onCloseModal}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={async () => {
            await onConfirm();
            onCloseModal?.();
            await onAction?.();
          }}
          disabled={disabled}
        >
          {disabled ? (
            <>
              <span>Deleting..</span>
              <ImSpinner2 size={20} className="animate-spin" />
            </>
          ) : (
            "Delete"
          )}
        </Button>
      </div>
    </div>
  );
}

export default ConfirmDelete;
