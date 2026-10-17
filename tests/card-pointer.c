// Finite input client for the isolated compositor test only. WLR virtual-pointer v1.
#include <wayland-client.h>
#include <linux/input-event-codes.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <time.h>
#include <stdio.h>

static const struct wl_message pointer_requests[] = {
    {"motion", "uff", NULL}, {"motion_absolute", "uuuuu", NULL}, {"button", "uuu", NULL},
    {"axis", "uuf", NULL}, {"frame", "", NULL}, {"axis_source", "u", NULL},
    {"axis_stop", "uu", NULL}, {"axis_discrete", "uufi", NULL}, {"destroy", "", NULL}
};
static const struct wl_interface pointer_interface = {"zwlr_virtual_pointer_v1", 1, 9, pointer_requests, 0, NULL};
static const struct wl_interface* create_types[] = {&wl_seat_interface, &pointer_interface};
static const struct wl_message manager_requests[] = {{"create_virtual_pointer", "?on", create_types}, {"destroy", "", NULL}};
static const struct wl_interface manager_interface = {"zwlr_virtual_pointer_manager_v1", 1, 2, manager_requests, 0, NULL};
static struct wl_proxy* manager;
static void global(void* data, struct wl_registry* registry, uint32_t name, const char* interface, uint32_t version) {
    if (!strcmp(interface, manager_interface.name)) manager = wl_registry_bind(registry, name, &manager_interface, 1);
}
static void removed(void* data, struct wl_registry* registry, uint32_t name) {}
static const struct wl_registry_listener listener = {global, removed};

int main(int argc, char** argv) {
    // The harness verifies this signature differs from the desktop before setting it.
    const char* socket = getenv("WAYLAND_DISPLAY");
    const char* expected = getenv("DROKK_CARD_TEST_SIGNATURE");
    const char* signature = getenv("HYPRLAND_INSTANCE_SIGNATURE");
    if ((argc != 5 && argc != 6) || !socket || !expected || !signature || strcmp(expected, signature)) return 2;
    struct wl_display* display = wl_display_connect(NULL);
    if (!display) return 3;
    struct wl_registry* registry = wl_display_get_registry(display);
    wl_registry_add_listener(registry, &listener, NULL);
    wl_display_roundtrip(display);
    if (!manager) return 4;
    struct wl_proxy* pointer = wl_proxy_marshal_flags(manager, 0, &pointer_interface, 1, 0, NULL, NULL);
    wl_display_roundtrip(display);
    // This headless seat starts without a pointer; let Qt bind the new capability.
    const struct timespec settle = {0, 100000000};
    nanosleep(&settle, NULL);
    uint32_t now = 1;
    wl_proxy_marshal_flags(pointer, 1, NULL, 1, 0, now, (uint32_t)atoi(argv[1]), (uint32_t)atoi(argv[2]), (uint32_t)atoi(argv[3]), (uint32_t)atoi(argv[4]));
    wl_proxy_marshal_flags(pointer, 4, NULL, 1, 0);
    wl_display_roundtrip(display);
    nanosleep(&settle, NULL);
    wl_proxy_marshal_flags(pointer, 2, NULL, 1, 0, ++now, BTN_LEFT, WL_POINTER_BUTTON_STATE_PRESSED);
    wl_proxy_marshal_flags(pointer, 4, NULL, 1, 0);
    wl_display_roundtrip(display);
    if (argc == 6) { puts("pressed"); fflush(stdout); const struct timespec hold={0,400000000}; nanosleep(&hold,NULL); }
    nanosleep(&settle, NULL);
    wl_proxy_marshal_flags(pointer, 2, NULL, 1, 0, ++now, BTN_LEFT, WL_POINTER_BUTTON_STATE_RELEASED);
    wl_proxy_marshal_flags(pointer, 4, NULL, 1, 0);
    wl_display_roundtrip(display);
    nanosleep(&settle, NULL);
    wl_proxy_marshal_flags(pointer, 8, NULL, 1, WL_MARSHAL_FLAG_DESTROY);
    wl_proxy_marshal_flags(manager, 1, NULL, 1, WL_MARSHAL_FLAG_DESTROY);
    wl_registry_destroy(registry);
    wl_display_disconnect(display);
    return 0;
}
