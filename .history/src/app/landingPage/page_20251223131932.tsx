
import Link from "next/link";
import {
  Card,
  CardContent,
  //CardDescription,
  //CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, ShieldCheck, ShieldPlus } from "lucide-react";
export default function LandingPage() {
  {
    /* <div className="py-2 px-5">
      <div className="flex flex-col">
        <div className="bg-red flex w-[100%]"></div>
        <div className="flex flex-row items-center "></div>
      </div>
    </div>
    */
  }
  return (
    <div className="min-h-screen flex flex-col">
      <div className="grow">
        <div className="py-5 px-20">
          <div className="bg-[url(/test-background.jpg)] bg-cover bg-center flex h-[200px]">
            <Card className="relative top-3 left-5 z-10 h-[150px] w-[20%] bg-primary/50 border-none">
              <CardHeader className="flex-col">
                <CardTitle className="text-xl opacity-100 text-white">
                  Your GateWay to Community Action
                </CardTitle>
                <Link href="#">
                  <Button className="bg-accent w-[50%] text-black rounded-[2px]">
                    Pe S:Kaokan
                  </Button>
                </Link>
              </CardHeader>
            </Card>{" "}
          </div>
          <div className="flex flex-row items-center gap-7  justify-between px-10 pt-10">
            <Card className="p-10 rounded-none grow bg-secondary text-white pb-4">
              <CardHeader className="-mb-2.5">
                <CardTitle className="font-bold">For Residents</CardTitle>
              </CardHeader>
              <CardContent>
                <ol>
                  <li>Submit Concerns</li>
                  <li>Track Status</li>
                  <li>Get Notifications</li>
                </ol>
                <div className="flex justify-center items-center mt-4">
                  <User />
                </div>
              </CardContent>
            </Card>
            <Card className="p-10 rounded-none grow bg-accent pb-4">
              <CardHeader className="-mb-2.5">
                <CardTitle className="font-bold">For Officials</CardTitle>
              </CardHeader>
              <CardContent>
                <ol>
                  <li>Manage Concerns</li>
                  <li>Generate Update Reports</li>
                  <li>Update Status</li>
                </ol>
                <div className="flex justify-center items-center mt-4">
                  <ShieldCheck />
                </div>
              </CardContent>
            </Card>
            <Card className="text-white p-10 rounded-none grow bg-primary pb-4">
              <CardHeader className="mb-[-10px]">
                <CardTitle className="font-bold">For Administrators</CardTitle>
              </CardHeader>
              <CardContent>
                <ol>
                  <li>Manage Concerns</li>
                  <li>Generate Reports</li>
                  <li>Update Status</li>
                </ol>
                <div className="flex justify-center items-center mt-4">
                  <ShieldPlus />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
