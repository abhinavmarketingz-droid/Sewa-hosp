"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { BannerContent, CustomSectionContent, DestinationContent, ServiceContent } from "@/lib/content"

type AdminContentManagerProps = {
  initialServices: ServiceContent[]
  initialDestinations: DestinationContent[]
  initialBanners: BannerContent[]
  initialSections: CustomSectionContent[]
  canEdit: boolean
}

const parseLines = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)

const serializeLines = (values: string[]) => values.join("\n")

export function AdminContentManager({
  initialServices,
  initialDestinations,
  initialBanners,
  initialSections,
  canEdit,
}: AdminContentManagerProps) {
  const [services, setServices] = useState(initialServices)
  const [destinations, setDestinations] = useState(initialDestinations)
  const [banners, setBanners] = useState(initialBanners)
  const [sections, setSections] = useState(initialSections)
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
  const [bannerForm, setBannerForm] = useState({
    id: "",
    slug: "",
    message: "",
    ctaLabel: "",
    ctaUrl: "",
    variant: "primary",
    active: true,
    position: "",
  })
  const [sectionForm, setSectionForm] = useState({
    id: "",
    slug: "",
    title: "",
    body: "",
    imageUrl: "",
    ctaLabel: "",
    ctaUrl: "",
    position: "",
    active: true,
  })
  const [status, setStatus] = useState<string | null>(null)

  const servicePayload = useMemo(
    () => ({
      slug: serviceForm.slug.trim(),
      title: serviceForm.title.trim(),
      titleKey: serviceForm.titleKey.trim(),
      description: serviceForm.description.trim(),
      items: parseLines(serviceForm.items),
      position: serviceForm.position.trim() ? Number(serviceForm.position) : null,
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
      position: destinationForm.position.trim() ? Number(destinationForm.position) : null,
    }),
    [destinationForm],
  )

  const bannerPayload = useMemo(
    () => ({
      slug: bannerForm.slug.trim(),
      message: bannerForm.message.trim(),
      ctaLabel: bannerForm.ctaLabel.trim(),
      ctaUrl: bannerForm.ctaUrl.trim(),
      variant: bannerForm.variant,
      active: bannerForm.active,
      position: bannerForm.position.trim() ? Number(bannerForm.position) : null,
    }),
    [bannerForm],
  )

  const sectionPayload = useMemo(
    () => ({
      slug: sectionForm.slug.trim(),
      title: sectionForm.title.trim(),
      body: sectionForm.body.trim(),
      imageUrl: sectionForm.imageUrl.trim(),
      ctaLabel: sectionForm.ctaLabel.trim(),
      ctaUrl: sectionForm.ctaUrl.trim(),
      position: sectionForm.position.trim() ? Number(sectionForm.position) : null,
      active: sectionForm.active,
    }),
    [sectionForm],
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

  const resetBannerForm = () =>
    setBannerForm({
      id: "",
      slug: "",
      message: "",
      ctaLabel: "",
      ctaUrl: "",
      variant: "primary",
      active: true,
      position: "",
    })

  const resetSectionForm = () =>
    setSectionForm({
      id: "",
      slug: "",
      title: "",
      body: "",
      imageUrl: "",
      ctaLabel: "",
      ctaUrl: "",
      position: "",
      active: true,
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

  const handleBannerSubmit = async () => {
    setStatus(null)
    const isEditing = Boolean(bannerForm.id)
    const endpoint = isEditing ? `/api/admin/banners/${bannerForm.id}` : "/api/admin/banners"
    const method = isEditing ? "PUT" : "POST"

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bannerPayload),
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      setStatus(payload?.error ?? "Unable to save banner.")
      return
    }

    const data = (await response.json()) as { banners: BannerContent[] }
    setBanners(data.banners)
    resetBannerForm()
    setStatus("Banner saved.")
  }

  const handleSectionSubmit = async () => {
    setStatus(null)
    const isEditing = Boolean(sectionForm.id)
    const endpoint = isEditing ? `/api/admin/sections/${sectionForm.id}` : "/api/admin/sections"
    const method = isEditing ? "PUT" : "POST"

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sectionPayload),
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      setStatus(payload?.error ?? "Unable to save section.")
      return
    }

    const data = (await response.json()) as { sections: CustomSectionContent[] }
    setSections(data.sections)
    resetSectionForm()
    setStatus("Section saved.")
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

  const handleDeleteBanner = async (id: string) => {
    setStatus(null)
    const response = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" })
    if (!response.ok) {
      setStatus("Unable to delete banner.")
      return
    }
    const data = (await response.json()) as { banners: BannerContent[] }
    setBanners(data.banners)
  }

  const handleDeleteSection = async (id: string) => {
    setStatus(null)
    const response = await fetch(`/api/admin/sections/${id}`, { method: "DELETE" })
    if (!response.ok) {
      setStatus("Unable to delete section.")
      return
    }
    const data = (await response.json()) as { sections: CustomSectionContent[] }
    setSections(data.sections)
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

  const loadBannerForEdit = (banner: BannerContent) => {
    setBannerForm({
      id: banner.id,
      slug: banner.slug,
      message: banner.message,
      ctaLabel: banner.ctaLabel ?? "",
      ctaUrl: banner.ctaUrl ?? "",
      variant: banner.variant ?? "primary",
      active: banner.active !== false,
      position: "",
    })
  }

  const loadSectionForEdit = (section: CustomSectionContent) => {
    setSectionForm({
      id: section.id,
      slug: section.slug,
      title: section.title,
      body: section.body,
      imageUrl: section.imageUrl ?? "",
      ctaLabel: section.ctaLabel ?? "",
      ctaUrl: section.ctaUrl ?? "",
      position: "",
      active: section.active !== false,
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
          <TabsList className="mb-6 flex flex-wrap">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="banners">Banners</TabsTrigger>
            <TabsTrigger value="sections">Custom Sections</TabsTrigger>
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
              <Button onClick={handleServiceSubmit} disabled={!canEdit}>
                {serviceForm.id ? "Update Service" : "Add Service"}
              </Button>
              {serviceForm.id && (
                <Button variant="outline" onClick={resetServiceForm} disabled={!canEdit}>
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
                        <Button size="sm" variant="outline" onClick={() => loadServiceForEdit(service)} disabled={!canEdit}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteService(service.id)} disabled={!canEdit}>
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
              <Button onClick={handleDestinationSubmit} disabled={!canEdit}>
                {destinationForm.id ? "Update Destination" : "Add Destination"}
              </Button>
              {destinationForm.id && (
                <Button variant="outline" onClick={resetDestinationForm} disabled={!canEdit}>
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
                        <Button size="sm" variant="outline" onClick={() => loadDestinationForEdit(destination)} disabled={!canEdit}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteDestination(destination.id)} disabled={!canEdit}>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="banners" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Slug (e.g. founders-message)"
                value={bannerForm.slug}
                onChange={(event) => setBannerForm((prev) => ({ ...prev, slug: event.target.value }))}
              />
              <Input
                placeholder="Message"
                value={bannerForm.message}
                onChange={(event) => setBannerForm((prev) => ({ ...prev, message: event.target.value }))}
              />
              <Input
                placeholder="CTA Label"
                value={bannerForm.ctaLabel}
                onChange={(event) => setBannerForm((prev) => ({ ...prev, ctaLabel: event.target.value }))}
              />
              <Input
                placeholder="CTA URL"
                value={bannerForm.ctaUrl}
                onChange={(event) => setBannerForm((prev) => ({ ...prev, ctaUrl: event.target.value }))}
              />
              <Input
                placeholder="Variant (primary/secondary/neutral)"
                value={bannerForm.variant}
                onChange={(event) => setBannerForm((prev) => ({ ...prev, variant: event.target.value }))}
              />
              <Input
                placeholder="Position (optional)"
                value={bannerForm.position}
                onChange={(event) => setBannerForm((prev) => ({ ...prev, position: event.target.value }))}
              />
              <div className="flex items-center gap-2">
                <Switch
                  checked={bannerForm.active}
                  onCheckedChange={(checked) => setBannerForm((prev) => ({ ...prev, active: checked }))}
                />
                <span className="text-sm text-muted-foreground">{bannerForm.active ? "Enabled" : "Disabled"}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleBannerSubmit} disabled={!canEdit}>
                {bannerForm.id ? "Update Banner" : "Add Banner"}
              </Button>
              {bannerForm.id && (
                <Button variant="outline" onClick={resetBannerForm} disabled={!canEdit}>
                  Cancel
                </Button>
              )}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slug</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>{banner.slug}</TableCell>
                    <TableCell className="text-sm text-muted-foreground line-clamp-2">{banner.message}</TableCell>
                    <TableCell>{banner.active !== false ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => loadBannerForEdit(banner)} disabled={!canEdit}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteBanner(banner.id)}
                          disabled={!canEdit}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="sections" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                placeholder="Slug (e.g. membership)"
                value={sectionForm.slug}
                onChange={(event) => setSectionForm((prev) => ({ ...prev, slug: event.target.value }))}
              />
              <Input
                placeholder="Title"
                value={sectionForm.title}
                onChange={(event) => setSectionForm((prev) => ({ ...prev, title: event.target.value }))}
              />
              <Input
                placeholder="Image URL"
                value={sectionForm.imageUrl}
                onChange={(event) => setSectionForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
              />
              <Input
                placeholder="CTA Label"
                value={sectionForm.ctaLabel}
                onChange={(event) => setSectionForm((prev) => ({ ...prev, ctaLabel: event.target.value }))}
              />
              <Input
                placeholder="CTA URL"
                value={sectionForm.ctaUrl}
                onChange={(event) => setSectionForm((prev) => ({ ...prev, ctaUrl: event.target.value }))}
              />
              <Input
                placeholder="Position (optional)"
                value={sectionForm.position}
                onChange={(event) => setSectionForm((prev) => ({ ...prev, position: event.target.value }))}
              />
              <div className="flex items-center gap-2">
                <Switch
                  checked={sectionForm.active}
                  onCheckedChange={(checked) => setSectionForm((prev) => ({ ...prev, active: checked }))}
                />
                <span className="text-sm text-muted-foreground">{sectionForm.active ? "Enabled" : "Disabled"}</span>
              </div>
              <Textarea
                placeholder="Body"
                value={sectionForm.body}
                onChange={(event) => setSectionForm((prev) => ({ ...prev, body: event.target.value }))}
                rows={4}
                className="md:col-span-2"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSectionSubmit} disabled={!canEdit}>
                {sectionForm.id ? "Update Section" : "Add Section"}
              </Button>
              {sectionForm.id && (
                <Button variant="outline" onClick={resetSectionForm} disabled={!canEdit}>
                  Cancel
                </Button>
              )}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slug</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sections.map((section) => (
                  <TableRow key={section.id}>
                    <TableCell>{section.slug}</TableCell>
                    <TableCell>{section.title}</TableCell>
                    <TableCell>{section.active !== false ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => loadSectionForEdit(section)} disabled={!canEdit}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteSection(section.id)}
                          disabled={!canEdit}
                        >
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
