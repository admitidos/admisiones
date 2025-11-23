"use client";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { ArrowLeft, Home, FileQuestion } from "lucide-react";
import { useEffect, useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if there's history to go back to
    setCanGoBack(window.history.length > 1);
  }, []);

  const handleGoBack = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl" shadow="sm">
        <CardBody className="gap-6 p-8 text-center sm:p-12">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary-100 p-6 dark:bg-primary-900/20">
              <FileQuestion className="h-16 w-16 text-primary sm:h-20 sm:w-20" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-bold sm:text-5xl">404</h1>
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
              Página no encontrada
            </h2>
            <p className="text-base text-default-600 sm:text-lg">
              Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
            <Button
              color="primary"
              size="lg"
              startContent={<ArrowLeft className="h-5 w-5" />}
              onPress={handleGoBack}
              className="font-semibold"
            >
              {canGoBack ? "Volver atrás" : "Ir al inicio"}
            </Button>

            {canGoBack && (
              <Button
                variant="bordered"
                size="lg"
                startContent={<Home className="h-5 w-5" />}
                onPress={handleGoHome}
                className="font-semibold"
              >
                Ir al inicio
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
