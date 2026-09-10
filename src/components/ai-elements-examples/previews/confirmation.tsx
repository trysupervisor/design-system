// Modified for Supervisor previews. License: Apache 2.0.
"use client";

import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRejected,
  ConfirmationRequest,
  ConfirmationTitle,
} from "@/components/ai-elements/confirmation";
import { CheckIcon, XIcon } from "lucide-react";
import { useState } from "react";

type Decision = "pending" | "approved" | "rejected";

const Example = () => {
  const [decision, setDecision] = useState<Decision>("pending");
  const approval = decision === "pending"
    ? { id: "delete-example" }
    : { id: "delete-example", approved: decision === "approved" };
  const state = decision === "pending" ? "approval-requested" : "approval-responded";

  return (
    <div className="w-full max-w-2xl">
      <Confirmation approval={approval} state={state}>
      <ConfirmationTitle>
        <ConfirmationRequest>
          This tool wants to delete the file{" "}
          <code className="inline rounded bg-muted px-1.5 py-0.5 text-sm">
            /tmp/example.txt
          </code>
          . Do you approve this action?
        </ConfirmationRequest>
        <ConfirmationAccepted>
          <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
          <span>You approved this tool execution</span>
        </ConfirmationAccepted>
        <ConfirmationRejected>
          <XIcon className="size-4 text-destructive" />
          <span>You rejected this tool execution</span>
        </ConfirmationRejected>
      </ConfirmationTitle>
      <ConfirmationActions>
        <ConfirmationAction onClick={() => setDecision("rejected")} variant="outline">
          Reject
        </ConfirmationAction>
        <ConfirmationAction onClick={() => setDecision("approved")} variant="default">
          Approve
        </ConfirmationAction>
      </ConfirmationActions>
      </Confirmation>
    </div>
  );
};

export default Example;
