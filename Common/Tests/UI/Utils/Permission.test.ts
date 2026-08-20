import { afterEach, describe, expect, test } from "@jest/globals";
import PermissionUtil from "../../../UI/Utils/Permission";
import ObjectID from "../../../Types/ObjectID";
import Permission, {
  UserGlobalAccessPermission,
  UserTenantAccessPermission,
} from "../../../Types/Permission";

describe("PermissionUtil.getAllPermissions", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("returns global and project allow permissions without project block permissions", () => {
    const globalPermissions: UserGlobalAccessPermission = {
      _type: "UserGlobalAccessPermission",
      projectIds: [],
      globalPermissions: [Permission.User],
    };
    const projectPermissions: UserTenantAccessPermission = {
      _type: "UserTenantAccessPermission",
      projectId: new ObjectID("00000000-0000-4000-8000-000000000001"),
      permissions: [
        {
          _type: "UserPermission",
          permission: Permission.ProjectOwner,
          labelIds: [],
          isBlockPermission: false,
        },
        {
          _type: "UserPermission",
          permission: Permission.DeleteProject,
          labelIds: [],
        },
        {
          _type: "UserPermission",
          permission: Permission.ProjectAdmin,
          labelIds: [],
          isBlockPermission: true,
        },
      ],
    };

    jest
      .spyOn(PermissionUtil, "getGlobalPermissions")
      .mockReturnValue(globalPermissions);
    jest
      .spyOn(PermissionUtil, "getProjectPermissions")
      .mockReturnValue(projectPermissions);

    expect(PermissionUtil.getAllPermissions()).toEqual([
      Permission.User,
      Permission.ProjectOwner,
      Permission.DeleteProject,
    ]);
  });
});
