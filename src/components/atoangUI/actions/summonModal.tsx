import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FormEvent, useState } from "react";
import Calendar from "../calendar";
import { TimePicker12Demo } from "@/components/ui/time-picker-12h";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { handleGenerateWord } from "@/lib/pdf/createDocx";
import { toast } from "sonner";
import { useSummon } from "@/hooks/useSummon";
import { useConcern } from "@/contexts/concernContext";
import { SummonForm, SummonFormSchema } from "@/defs/summon";
export default function GenerateSummonModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const [form, setForm] = useState<SummonForm>({
    residentId: null as unknown as number,
    summonDate: null as unknown as Date,
    startTime: null as unknown as Date,
    endTime: null as unknown as Date,
    files: [],
  });
  const { concern } = useConcern();
  const [openCalendar, setOpenCalendar] = useState(false);
  const [requireDocument, setRequiredDocument] = useState(false);
  const {
    selectedDate,
    setSelectedDate,
    selectStart,
    setSelectStart,
    selectEnd,
    setSelectEnd,
  } = useSummon();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // Calendar
  const handleDateSelected = (date: Date) => {
    setSelectedDate(date);
    setOpenCalendar(false);
  };
  // Time
  const handlePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = SummonFormSchema.safeParse({
      residentId: concern.user.id,
      summonDate: selectedDate,
      endTime: selectEnd,
      startTime: selectStart,
      files: selectedFile ? [selectedFile] : [],
    });
    if (!validation.success) {
      toast.error("Error validating summon request", {
        description: Object.values(validation.error.flatten().fieldErrors)
          .flat()
          .join(", "),
      });
      return;
    }
    if (!concern?.user?.id) {
      toast.error("Resident not found.");
      return;
    }

    if (!selectedDate || !selectStart) {
      toast.error("Please select date and start time.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("residentId", concern?.user.id);

      formData.append("date", selectedDate.toISOString());
      formData.append("startTime", selectStart.toISOString());

      if (selectEnd) {
        formData.append("endTime", selectEnd.toISOString());
      }

      if (selectedFile) {
        formData.append("files", selectedFile);
      }

      const res = await fetch(`/api/summon/${concern?.id}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error ? data.error: data.message ? data.message : "error upon creating summon")
        return
      }
      setForm({
        residentId: null as unknown as number,
        summonDate: null as unknown as Date,
        startTime: null as unknown as Date,
        endTime: null as unknown as Date,
        files: [],
      });
      toast.success("Resident successfully summoned.");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong upon creating summon.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-2 max-w-none! max-h-none! border-0 lg:w-[70%] lg:h-[80%]!">
          <DialogTitle>Generate Summon</DialogTitle>
          <form onSubmit={handlePost}>
            <Button
              className={"w-fit"}
              type="button"
              onClick={() => setOpenCalendar(true)}
            >
              Select Date
            </Button>
            {selectedDate && (
              <p className="mt-2 text-sm">
                Selected Date For Summon: {selectedDate.toLocaleDateString()}
              </p>
            )}
            <div className="flex items-center space-x-2">
              <Switch
                id="require-doc"
                checked={requireDocument}
                onCheckedChange={setRequiredDocument}
              />
              <Label htmlFor="require-doc">
                Require Leagal papers? {requireDocument}
              </Label>

              <div>
                <div className="space-y-2">
                  <Input
                    className="cursor-pointer"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    id={"files"}
                    onChange={handleFileChange}
                    disabled={!requireDocument}
                  />
                  {selectedFile && (
                    <p className="text-xs text-muted-foreground">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
                <Button
                  disabled={!requireDocument || !selectedDate || !selectStart}
                  type="button"
                  onClick={() =>
                    handleGenerateWord({
                      fullname: concern?.user.fullname,
                      details: concern?.details,
                      selectedDate,
                      selectStart,
                      selectEnd,
                    })
                  }
                >
                  {!selectedDate
                    ? "Select Date First"
                    : !selectStart
                    ? "Select Start Time First"
                    : "Generate Document"}
                </Button>
              </div>
            </div>
            {/* Time end */}
            <TimePicker12Demo date={selectStart} setDate={setSelectStart} />
            {selectStart && (
              <div className="mt-2 text-sm">
                Selected Time Start:{" "}
                {`${selectStart.getHours() % 12 || 12} : ${selectStart
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")} ${
                  selectStart.getHours() >= 12 ? "PM" : "AM"
                }`}
              </div>
            )}
            {/* Time end */}
            <TimePicker12Demo date={selectEnd} setDate={setSelectEnd} />
            {selectEnd && (
              <span>
                End:{" "}
                {`${selectEnd.getHours() % 12 || 12} : ${selectEnd
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")} ${
                  selectEnd.getHours() >= 12 ? "PM" : "AM"
                }`}
              </span>
            )}
            <Button type="submit" disabled={isLoading}>
              Summon
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={openCalendar} onOpenChange={setOpenCalendar}>
        <DialogContent className="p-1 max-w-none! max-h-none! border-0 lg:w-[70%] lg:h-[80%]!">
          <DialogTitle>SelectDate</DialogTitle>
          <div className="h-[80%] w-full ">
            <Calendar onDateSelect={handleDateSelected} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
//https://time.openstatus.dev/#time-picker-utils.tsx


