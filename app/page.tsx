import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui"

import { VehicleFormDemo } from "./components/vehicle-form-demo"

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="font-mono text-label-md uppercase text-on-surface-variant">
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-surface">
      {/* Navy-on-white lockup with a mustard accent bar (DESIGN.md). */}
      <header className="border-b-2 border-brand-mustard bg-surface-container-lowest">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-8">
          {/* eslint-disable-next-line @next/next/no-img-element -- brand wordmark SVG, no optimization needed */}
          <img alt="logiFleet" className="h-9 w-auto" src="/logo.svg" />
          <Badge variant="warning">Design System</Badge>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 py-12 sm:px-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-display text-brand-navy">Industrial Precision</h1>
          <p className="max-w-2xl text-body-lg text-on-surface-variant">
            The component language for logiFleet — engineered for reliability,
            movement, and precision. Navy for trust, mustard for action.
          </p>
        </div>

        <Section title="Typography">
          <div className="flex flex-col gap-2">
            <p className="text-display text-on-surface">Display 48</p>
            <p className="text-headline-lg text-on-surface">Headline LG 32</p>
            <p className="text-headline-md text-on-surface">Headline MD 24</p>
            <p className="text-body-lg text-on-surface">Body LG 18 — fleet status overview</p>
            <p className="text-body-md text-on-surface">Body MD 16 — standard reading size</p>
            <p className="font-mono text-label-md uppercase text-on-surface-variant">
              Label MD 13 · VIN 1HGCM82633A004352
            </p>
          </div>
        </Section>

        <Section title="Buttons">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary">Dispatch</Button>
            <Button variant="secondary">View route</Button>
            <Button variant="tertiary">Cancel</Button>
            <Button disabled variant="primary">
              Disabled
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </Section>

        <Section title="Status badges">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="success">In transit</Badge>
            <Badge variant="warning">Idle</Badge>
            <Badge variant="error">Out of service</Badge>
            <Badge variant="navy">Maintenance</Badge>
            <Badge variant="neutral">Unknown</Badge>
          </div>
        </Section>

        <Section title="Cards">
          <div className="grid gap-5 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Truck 04</CardTitle>
                  <Badge variant="warning">Idle</Badge>
                </div>
                <CardDescription>Freightliner Cascadia · 2022</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-label-md text-on-surface-variant">
                  VIN 1FUJGLDR9CLBP8834
                </p>
              </CardContent>
            </Card>

            <Card selected>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Truck 11</CardTitle>
                  <Badge variant="success">In transit</Badge>
                </div>
                <CardDescription>Volvo VNL 860 · 2023 · selected</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-label-md text-on-surface-variant">
                  VIN 4V4NC9EH7PN612043
                </p>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section title="Form (useForm + yup)">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Add vehicle</CardTitle>
              <CardDescription>
                Text fields validate on blur; the status select validates on
                commit. See docs/forms.md.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VehicleFormDemo />
            </CardContent>
          </Card>
        </Section>
      </main>
    </div>
  )
}
