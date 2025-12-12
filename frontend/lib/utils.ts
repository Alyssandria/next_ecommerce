import { useLocalStorage } from "@/hooks/use-local-storage";
import { clsx, type ClassValue } from "clsx"
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fetchApi(route: string, opts?: RequestInit) {
  if (route.startsWith('/')) route = route.slice(1);
  return fetch(`${process.env.NEXT_PUBLIC_API_BASE}${route}`, {
    ...opts,
    headers: {
      ...opts?.headers,
      "Content-Type": "application/json",
    },
    credentials: 'include',
  });
}

export const getLocalStorage = (item: string) => {
  return typeof window !== "undefined" ? localStorage.getItem(item) : null;

}
export async function fetchWithAuth(route: string, opts?: RequestInit) {
  "use client"
  const token = getLocalStorage("token");
  console.log(token);

  if (!token) {
    return logout();
  }
  const res = await fetchApi(route, {
    ...opts,
    headers: {
      ...opts?.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    const refresh = await refreshToken();

    if (!refresh) {
      setTimeout(() => toast.error("Something went wrong, please try again later"));
    }

    return fetchApi(route, {
      ...opts,
      headers: {
        ...opts?.headers,
        Authorization: `Bearer ${refresh}`,
      },
    });
  }

  return res;
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
    ;
}

export function calculateOriginalPrice(price: number, discount: number) {
  return (((discount / 100) * price) + price);
}

export async function logout() {
  // CLIENT SIDE LOGOUT
  const { deleteItem } = useLocalStorage();
  deleteItem('token');

  const res = await fetchApi('/auth/logout', {
    method: "POST"
  });

  if (!res.ok) {
    setTimeout(() => toast.error('Something went wrong, please try again later'));
  }

  return redirect('/login');
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const formatted = date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return formatted;

}

export const formatCase = (s: string) => {
  const split = s.split(" ");

  if (split.length === 1) {
    return `${s.charAt(0).toUpperCase()}${s.slice(1)}`
  }

  return split.map(el => (
    `${el.charAt(0).toUpperCase()}${el.slice(1)}`
  )).join(" ");
}


export const setLocalStorage = (key: string, value: string) => {
  return typeof window !== "undefined" ? localStorage.setItem(key, value) : null;
}

export async function refreshToken(): Promise<never | string> {
  const refresh = await fetchApi('/auth/refresh', {
    method: "POST"
  });

  if (refresh.status === 403) {
    return logout();
  }

  const json = await refresh.json();

  setLocalStorage('token', json.token);
  return json.token;
}
