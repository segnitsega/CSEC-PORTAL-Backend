import { resourceRepository } from "../repositories/resource.repository";
import { canManageDivision } from "../utils/checkDivisionHead";
import { ServiceError } from "../errors/ServiceError";

export const resourceService = {
  async addResource(
    actorClubRole: string,
    body: { resourceName?: string; resourceLink?: string; division?: string }
  ) {
    if (actorClubRole === "Member") {
      throw ServiceError.message(403, "Unauthorized to add resources");
    }
    const { resourceName, resourceLink, division } = body;
    if (await canManageDivision(actorClubRole, division as string)) {
      const newResource = await resourceRepository.create({
        resourceName,
        resourceLink,
        division,
      });
      return { message: "New resource added successfully", Resource: newResource };
    }
    throw ServiceError.message(
      403,
      `${actorClubRole} can not add resource in ${division}`
    );
  },

  async listResources() {
    const resources = await resourceRepository.findAll();
    if (!resources) {
      throw ServiceError.message(404, "No resources found");
    }
    return {
      totalResources: resources.length,
      Resources: resources,
    };
  },

  async deleteResource(actorClubRole: string, id: string) {
    if (actorClubRole === "Member") {
      throw ServiceError.message(403, `${actorClubRole} cannot delete a resource`);
    }
    const resource = await resourceRepository.findById(id);
    if (await canManageDivision(actorClubRole, resource?.division!)) {
      const deletedResource = await resourceRepository.deleteById(id);
      if (!deletedResource) {
        throw ServiceError.message(404, "Resource not found");
      }
      return { message: "Resource deleted successfully" };
    }
    throw ServiceError.message(403, "Unauthorized to delete this resource");
  },

  async updateResource(actorClubRole: string, id: string, updatedData: unknown) {
    if (actorClubRole === "Member") {
      throw ServiceError.message(403, `${actorClubRole} cannot update a resource`);
    }
    const resource = await resourceRepository.findById(id);
    if (await canManageDivision(actorClubRole, resource?.division!)) {
      const updatedResource = await resourceRepository.updateById(
        id,
        updatedData as Record<string, unknown>
      );
      if (!updatedResource) {
        throw ServiceError.message(404, "Resource not found");
      }
      return { message: "Resource updated successfully", updatedResource };
    }
    throw ServiceError.message(403, "Unauthorized to update this resource");
  },
};
