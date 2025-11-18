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
export async function fetchWithAuth(route: string, opts?: RequestInit) {
  "use client"
  const { getItem } = useLocalStorage();
  const token = getItem("token");
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

export async function refreshToken(): Promise<never | string> {
  const refresh = await fetchApi('/auth/refresh', {
    method: "POST"
  });

  if (refresh.status === 403) {
    return logout();
  }

  const json = await refresh.json();

  const { setItem } = useLocalStorage();

  setItem('token', json.token);
  return json.token;
}
