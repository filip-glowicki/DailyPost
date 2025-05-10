import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="flex flex-col items-center text-center py-4 mb-12">
        <h1 className="text-5xl font-bold mb-4">DailyPost</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          Twórz, edytuj i zarządzaj postami z wykorzystaniem sztucznej
          inteligencji. Nasza aplikacja pomoże Ci generować wysokiej jakości
          treści w kilka sekund.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/sign-in">Zaloguj się</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/sign-up">Zarejestruj się</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Szybkie generowanie postów</CardTitle>
            <CardDescription>
              Oszczędzaj czas i zwiększ produktywność
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Generuj wysokiej jakości posty z wykorzystaniem sztucznej
              inteligencji w zaledwie kilka sekund.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inteligentne edytowanie</CardTitle>
            <CardDescription>Popraw jakość swoich tekstów</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Narzędzia oparte na AI pomogą Ci dopracować styl, ton i zawartość
              Twoich postów.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zarządzanie zawartością</CardTitle>
            <CardDescription>Wszystko w jednym miejscu</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Organizuj, kategoryzuj i planuj publikację swoich postów w
              intuicyjnym interfejsie.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
