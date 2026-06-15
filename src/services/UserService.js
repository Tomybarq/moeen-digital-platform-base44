/**
 * User Service — Mo'een Digital Platform
 *
 * Manages user listing, role changes, invites, and profile updates.
 */
import Base44Adapter from "@/adapters/Base44Adapter";

const UserService = {
  async getAll() {
    const result = await Base44Adapter.user.getAll();
    return result ?? [];
  },

  async update(id, data) {
    return Base44Adapter.user.update(id, data);
  },

  async updateMe(data) {
    return Base44Adapter.user.updateMe(data);
  },

  async inviteUser(email, role) {
    return Base44Adapter.user.inviteUser(email, role);
  },

  async getMe() {
    return Base44Adapter.user.getMe();
  },
};

export default UserService;