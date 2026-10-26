import { URL } from "url";

// Reserved private and loopback IPv4 address prefixes
const BLOCKED_IPV4_PREFIXES = [
  "127.",        // Loopback (127.0.0.0/8)
  "10.",         // Private Class A (10.0.0.0/8)
  "172.16.",     // Private Class B (172.16.0.0/12)
  "172.17.",
  "172.18.",
  "172.19.",
  "172.20.",
  "172.21.",
  "172.22.",
  "172.23.",
  "172.24.",
  "172.25.",
  "172.26.",
  "172.27.",
  "172.28.",
  "172.29.",
  "172.30.",
  "172.31.",
  "192.168.",    // Private Class C (192.168.0.0/16)
  "169.254.",    // Link-local / Cloud metadata (169.254.0.0/16)
  "0.",          // Current network
  "100.64.",     // Carrier-grade NAT
  "198.18.",     // Benchmarking
  "198.19.",
  "224.",        // Multicast
  "240.",        // Reserved
];

const BLOCKED_HOSTNAMES = [
  "localhost",
  "localhost.localdomain",
  "ip6-localhost",
  "ip6-loopback",
  "metadata.google.internal",
  "169.254.169.254", // AWS/GCP/Azure instance metadata service
];

export interface SSRFValidationResult {
  isValid: boolean;
  reason?: string;
  sanitizedUrl?: string;
}

/**
 * Validates a target URL against SSRF attacks before any network fetching.
 * Blocks private IP ranges, loopbacks, internal hostnames, and non-HTTP protocols.
 */
export function validateSafeUrl(urlString: string): SSRFValidationResult {
  if (!urlString || typeof urlString !== "string") {
    return { isValid: false, reason: "URL string is missing or invalid." };
  }

  let parsed: URL;
  try {
    parsed = new URL(urlString.trim());
  } catch {
    return { isValid: false, reason: "Malformed URL syntax." };
  }

  // Only allow HTTP and HTTPS protocols
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return {
      isValid: false,
      reason: `Protocol '${parsed.protocol}' is forbidden. Only HTTP/HTTPS allowed.`,
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block localhost and specific internal hostnames
  if (BLOCKED_HOSTNAMES.includes(hostname)) {
    return {
      isValid: false,
      reason: `Hostname '${hostname}' is restricted from outbound fetching.`,
    };
  }

  // Block internal domain suffixes (.local, .internal, .lan, .localhost, etc.)
  if (
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".lan") ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".corp")
  ) {
    return {
      isValid: false,
      reason: `Internal or intranet domains are restricted.`,
    };
  }

  // Block private/loopback IPv4 addresses
  for (const prefix of BLOCKED_IPV4_PREFIXES) {
    if (hostname.startsWith(prefix)) {
      return {
        isValid: false,
        reason: `Target IP falls within restricted or private CIDR range (${prefix}*).`,
      };
    }
  }

  // Block IPv6 loopback and unique local addresses
  if (
    hostname === "::1" ||
    hostname === "[::1]" ||
    hostname.startsWith("fc00:") ||
    hostname.startsWith("fe80:")
  ) {
    return {
      isValid: false,
      reason: "IPv6 loopback or link-local address is restricted.",
    };
  }

  // Ensure hostname has at least one dot unless it's an IP (which we already filtered)
  if (!hostname.includes(".")) {
    return {
      isValid: false,
      reason: "Top-level or unqualified hostnames are disallowed.",
    };
  }

  return {
    isValid: true,
    sanitizedUrl: parsed.toString(),
  };
}
