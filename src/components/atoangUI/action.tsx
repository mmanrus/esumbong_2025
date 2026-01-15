import { useConcern } from "@/contexts/concernContext";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import GenerateSummonModal from "./summon/summonModal";

export default function TakeActionModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { concernId, concern } = useConcern();
  const [openSummon, setOpenSummon] = useState(false);
  const [openMediation, setOpenMediation] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Take Action on Concern: {concernId}</DialogTitle>
          <div className="flex flex-row gap-3 justify-center">
            <Button onClick={() => setOpenSummon(true)}>Summon</Button>
            <Button onClick={() => setOpenMediation(true)}>Mediation</Button>
          </div>
        </DialogContent>
      </Dialog>
      <GenerateSummonModal open={openSummon} setOpen={setOpenSummon}/>
    </>
  );
}
