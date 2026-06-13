"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@/core/components/ui"
import { getUserMessage } from "@/core/errors"
import { createClient } from "@/lib/supabase/client"
import { runSupabase } from "@/lib/supabase/runSupabase"

const EQUIPMENT_QUERY_KEY = ["demo", "equipment"]

// End-to-end example of the data layer: read with inline error handling, write
// with the global error toast + cache invalidation. Backed by the example
// `equipment` table in lib/supabase/database.types.ts.
export default function DataDemoPage() {
  const [supabase] = useState(createClient)
  const queryClient = useQueryClient()

  const equipment = useQuery({
    queryKey: EQUIPMENT_QUERY_KEY,
    queryFn: ({ signal }) =>
      runSupabase(
        supabase
          .from("equipment")
          .select("*")
          .order("created_at", { ascending: false })
          .abortSignal(signal),
      ),
    meta: { skipGlobalErrorToast: true },
  })

  const [name, setName] = useState("")
  const [serial, setSerial] = useState("")

  const addEquipment = useMutation({
    mutationFn: (input: { name: string; serial: string }) =>
      runSupabase(
        supabase.from("equipment").insert(input).select("*").single(),
      ),
    onSuccess: (created) => {
      toast.success("Equipment added", { description: created.name })
      setName("")
      setSerial("")
      queryClient.invalidateQueries({ queryKey: EQUIPMENT_QUERY_KEY })
    },
  })

  const canSubmit = name.trim().length > 0 && serial.trim().length > 0

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-8">
      <Card>
        <CardHeader>
          <CardTitle>Equipment</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {equipment.isLoading && (
            <p className="text-body-sm text-on-surface-variant">
              Loading equipment…
            </p>
          )}

          {equipment.error && (
            <p className="text-body-sm text-status-error">
              {getUserMessage(equipment.error).title}
            </p>
          )}

          {equipment.data?.length === 0 && (
            <p className="text-body-sm text-on-surface-variant">
              No equipment yet.
            </p>
          )}

          {equipment.data && equipment.data.length > 0 && (
            <ul className="flex flex-col divide-y divide-outline-variant">
              {equipment.data.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between py-2"
                >
                  <span className="text-body-md text-on-surface">
                    {item.name}
                  </span>
                  <Badge variant="neutral">{item.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add equipment</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Input
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Input
            placeholder="Serial number"
            value={serial}
            onChange={(event) => setSerial(event.target.value)}
          />
          <Button
            disabled={!canSubmit || addEquipment.isPending}
            onClick={() =>
              addEquipment.mutate({ name: name.trim(), serial: serial.trim() })
            }
          >
            {addEquipment.isPending ? "Adding…" : "Add equipment"}
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
