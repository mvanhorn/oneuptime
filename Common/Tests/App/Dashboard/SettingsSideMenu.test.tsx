import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import React from "react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from "@jest/globals";
import Permission from "../../../Types/Permission";
import PermissionUtil from "../../../UI/Utils/Permission";
import User from "../../../UI/Utils/User";
import { getJestSpyOn } from "../../Spy";
import SettingsSideMenu from "../../../../App/FeatureSet/Dashboard/src/Pages/Settings/SideMenu";
import {
  DESKTOP_WIDTH,
  PROJECT_ID,
  goTo,
  renderMenu,
  sectionTitlesInOrder,
  setViewportWidth,
} from "./SideMenuHarness";

describe("Settings side menu", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    setViewportWidth(DESKTOP_WIDTH);
    goTo(`/dashboard/${PROJECT_ID}/settings`);
    getJestSpyOn(User, "isMasterAdmin").mockReturnValue(false);
  });

  afterEach(() => {
    cleanup();
  });

  it.each([Permission.ProjectOwner, Permission.DeleteProject])(
    "shows Danger Zone to a user with %s",
    async (permission: Permission) => {
      getJestSpyOn(PermissionUtil, "getAllPermissions").mockReturnValue([
        permission,
      ]);

      await renderMenu(<SettingsSideMenu />);

      expect(sectionTitlesInOrder()).toContain("Danger Zone");
    },
  );

  it("hides Danger Zone from a project member", async () => {
    getJestSpyOn(PermissionUtil, "getAllPermissions").mockReturnValue([
      Permission.ProjectMember,
    ]);

    await renderMenu(<SettingsSideMenu />);

    expect(sectionTitlesInOrder()).not.toContain("Danger Zone");
  });

  it("hides Danger Zone when block-only permissions yield no grants", async () => {
    getJestSpyOn(PermissionUtil, "getAllPermissions").mockReturnValue([]);

    await renderMenu(<SettingsSideMenu />);

    expect(sectionTitlesInOrder()).not.toContain("Danger Zone");
  });

  it("shows Danger Zone to a master admin", async () => {
    getJestSpyOn(PermissionUtil, "getAllPermissions").mockReturnValue([]);
    getJestSpyOn(User, "isMasterAdmin").mockReturnValue(true);

    await renderMenu(<SettingsSideMenu />);

    expect(sectionTitlesInOrder()).toContain("Danger Zone");
  });
});
