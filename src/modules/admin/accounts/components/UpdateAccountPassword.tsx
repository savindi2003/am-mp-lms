import * as React from "react";
import { Button } from "@/modules/ui/button";
import { ImSpinner2 } from "react-icons/im";

function UpdateAccountPassword({
  pwd,
  onChange,
  onSubmit,
  onCloseModal,
  disabled,
}: {
  pwd: string;
  onChange: (v: string) => void;
  onSubmit: (pwd: string, onClose?: () => void) => void;
  onCloseModal?: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col gap-5 items-center text-sm">
      <label className="font-medium">Reset Password</label>
      <input
        type="password"
        className="input"
        value={pwd}
        onChange={(e) => onChange(e.target.value)}
        placeholder="New password (min 8 chars)"
        minLength={8}
      />
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onCloseModal}>
          Cancel
        </Button>
        <Button variant="gray" onClick={() => onSubmit(pwd, onCloseModal)}>
          {disabled ? (
            <>
              <span>Updating..</span>
              <ImSpinner2 size={20} className="animate-spin" />
            </>
          ) : (
            "Update"
          )}
        </Button>
      </div>
    </div>
  );
}

export default UpdateAccountPassword;
