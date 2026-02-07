"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { DestinationContent, ServiceContent } from "@/lib/content"

type AdminContentManagerProps = {
  initialServices: ServiceContent[]
  initialDestinations: DestinationContent[]
}

const parseLines = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)

const serializeLines = (values: string[]) => values.join("\n")

export function AdminContentManager({ initialServices, initialDestinations }: AdminContentManagerProps) {
  const [services, setServices] = useState(initialServices)
  const [destinations, setDestinations] = useState(initialDestinations)
  const [serviceForm, setServiceForm] = useState({
    id: "",
    slug: "",
    title: "",
    titleKey: "",
    description: "",
    items: "",
    position: "",
  })
  const [destinationForm, setDestinationForm] = useState({
    id: "",
    slug: "",
    name: "",
    headline: "",
    description: "",
    services: "",
    highlights: "",
    imageUrl: "",
    position: "",
  })
  const [status, setStatus] = useState<string | null>(null)

  const servicePayload = useMemo(
    () => ({
      slug: serviceForm.slug.trim(),
      title: serviceForm.title.trim(),
      titleKey: serviceForm.titleKey.trim(),
      description: serviceForm.description.trim(),
      items: parseLines(serviceForm.items),
      position: serviceForm.position ? Number(serviceForm.position) : null,
    }),
    [serviceForm],
  )

  const destinationPayload = useMemo(
    () => ({
      slug: destinationForm.slug.trim(),
      name: destinationForm.name.trim(),
      headline: destinationForm.headline.trim(),
      description: destinationForm.description.trim(),
      services: parseLines(destinationForm.services),
      highlights: parseLines(destinationForm.highlights),
      imageUrl: destinationForm.imageUrl.trim(),
      position: destinationForm.position ? Number(destinationForm.position) : null,
    }),
    [destinationForm],
  )

  const resetServiceForm = () =>
    setServiceForm({ id: "", slug: "", title: "", titleKey: "", description: "", items: "", position: "" })

  const resetDestinationForm = () =>
    setDestinationForm({
      id: "",
      slug: "",
      name: "",
      headline: "",
      description: "",
      services: "",
      highlights: "",
      imageUrl: "",
      position: "",
    })

  const handleServiceSubmit = async () => {
    setStatus(null)
    const isEditing = Boolean(serviceForm.id)
    const endpoint = isEditing ? `/api/admin/services/${serviceForm.id}` : "/api/admin/services"
    const method = isEditing ? "PUT" : "POST"

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(servicePayload),
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      setStatus(payload?.error ?? "Unable to save service content.")
      return
    }

    const data = (await response.json()) as { services: ServiceContent[] }
    setServices(data.services)
    resetServiceForm()
    setStatus("Service content saved.")
  }

  const handleDestinationSubmit = async () => {
    setStatus(null)
    const isEditing = Boolean(destinationForm.id)
    const endpoint = isEditing ? `/api/admin/destinations/${destinationForm.id}` : "/api/admin/destinations"
    const method = isEditing ? "PUT" : "POST"

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(destinationPayload),
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      setStatus(payload?.error ?? "Unable to save destination content.")
      return
    }

    const data = (await response.json()) as { destinations: DestinationContent[] }
    setDestinations(data.destinations)
    resetDestinationForm()
    setStatus("Destination content saved.")
  }

  const handleDeleteService = async (id: string) => {
    setStatus(null)
    const response = await fetch(`/api/admin/services/${id}`, { method: "DELETE" })
    if (!response.ok) {
      setStatus("Unable to delete service content.")
      return
    }
    const data = (await response.json()) as { services: ServiceContent[] }
    setServices(data.services)
  }

  const handleDeleteDestination = async (id: string) => {
    setStatus(null)
    const response = await fetch(`/api/admin/destinations/${id}`, { method: "DELETE" })
    if (!response.ok) {
      setStatus("Unable to delete destination content.")
      return
    }
    const data = (await response.json()) as { destinations: DestinationContent[] }
    setDestinations(data.destinations)
  }

  const loadServiceForEdit = (service: ServiceContent) => {
    setServiceForm({
      id: service.id,
      slug: service.slug,
      title: service.title,
      titleKey: service.titleKey ?? "",
      description: service.description,
      items: serializeLines(service.items),
      position: "",
    })
  }

  const loadDestinationForEdit = (destination: DestinationContent) => {
    setDestinationForm({
      id: destination.id,
      slug: destination.slug,
      name: destination.name,
      headline: destination.headline,
      description: destination.description,
      services: serializeLines(destination.services),
      highlights: serializeLines(destination.highlights),
      imageUrl: destination.imageUrl ?? "",
      position: "",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-serif">Content Management</CardTitle>
        <CardDescription>Manage homepage and page content for services and destinations.</CardDescription>
      </CardHeader>
      <CardContent>
        {status && <p className="mb-4 text-sm text-primary">{status}</p>}
        <Tabs defaultValue="services">
          <TabsList className="mb-6">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Slug (e.g. travel)"
                value={serviceForm.slug}
                onChange={(event) => setServiceForm((prev) => ({ ...prev, slug: event.target.value }))}
              />
              <Input
                placeholder="Title"
                value={serviceForm.title}
                onChange={(event) => setServiceForm((prev) => ({ ...prev, title: event.target.value }))}
              />
              <Input
                placeholder="Title translation key (optional)"
                value={serviceForm.titleKey}
                onChange={(event) => setServiceForm((prev) => ({ ...prev, titleKey: event.target.value }))}
              />
              <Input
                placeholder="Position (optional)"
                value={serviceForm.position}
                onChange={(event) => setServiceForm((prev) => ({ ...prev, position: event.target.value }))}
              />
              <Textarea
                placeholder="Description"
                value={serviceForm.description}
                onChange={(event) => setServiceForm((prev) => ({ ...prev, description: event.target.value }))}
                rows={4}
              />
              <Textarea
                placeholder="Items (one per line)"
                value={serviceForm.items}
                onChange={(event) => setServiceForm((prev) => ({ ...prev, items: event.target.value }))}
                rows={6}
                className="md:col-span-2"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleServiceSubmit}>{serviceForm.id ? "Update Service" : "Add Service"}</Button>
              {serviceForm.id && (
                <Button variant="outline" onClick={resetServiceForm}>
                  Cancel
                </Button>
              )}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slug</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.slug}</TableCell>
                    <TableCell>{service.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground line-clamp-2">
                      {service.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => loadServiceForEdit(service)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteService(service.id)}>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="destinations" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Slug (e.g. delhi-ncr)"
                value={destinationForm.slug}
                onChange={(event) => setDestinationForm((prev) => ({ ...prev, slug: event.target.value }))}
              />
              <Input
                placeholder="Name"
                value={destinationForm.name}
                onChange={(event) => setDestinationForm((prev) => ({ ...prev, name: event.target.value }))}
              />
              <Input
                placeholder="Headline"
                value={destinationForm.headline}
                onChange={(event) => setDestinationForm((prev) => ({ ...prev, headline: event.target.value }))}
              />
              <Input
                placeholder="Image URL"
                value={destinationForm.imageUrl}
                onChange={(event) => setDestinationForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
              />
              <Input
                placeholder="Position (optional)"
                value={destinationForm.position}
                onChange={(event) => setDestinationForm((prev) => ({ ...prev, position: event.target.value }))}
              />
              <Textarea
                placeholder="Description"
                value={destinationForm.description}
                onChange={(event) => setDestinationForm((prev) => ({ ...prev, description: event.target.value }))}
                rows={4}
                className="md:col-span-2"
              />
              <Textarea
                placeholder="Services (one per line)"
                value={destinationForm.services}
                onChange={(event) => setDestinationForm((prev) => ({ ...prev, services: event.target.value }))}
                rows={4}
              />
              <Textarea
                placeholder="Highlights (one per line)"
                value={destinationForm.highlights}
                onChange={(event) => setDestinationForm((prev) => ({ ...prev, highlights: event.target.value }))}
                rows={4}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleDestinationSubmit}>
                {destinationForm.id ? "Update Destination" : "Add Destination"}
              </Button>
              {destinationForm.id && (
                <Button variant="outline" onClick={resetDestinationForm}>
                  Cancel
                </Button>
              )}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slug</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Headline</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {destinations.map((destination) => (
                  <TableRow key={destination.id}>
                    <TableCell>{destination.slug}</TableCell>
                    <TableCell>{destination.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground line-clamp-2">
                      {destination.headline}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => loadDestinationForEdit(destination)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteDestination(destination.id)}>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
