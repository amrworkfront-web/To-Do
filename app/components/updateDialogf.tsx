import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
interface DialogDemoProps {
  title: string;
  description?: string;
}
export function DialogDemo( { title ,description}: DialogDemoProps) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Update</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Your Task</DialogTitle>
            <DialogDescription>
              Make changes to your task here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <label htmlFor="title-1">Title</label>
              <Input id="title-1" name="title" defaultValue={title} />
            </div>
            <div className="grid gap-3">
              <label htmlFor="description-1">Description</label>
              <Input id="description-1" name="description" defaultValue={`${description }  `} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
