import { AuthButtonServer } from "@/app/components/auth-button-server";

const backgroundURL = "/back1.avif";
export default function Login() {
  return (
    <div
      className="flex h-screen w-full items-center justify-center bg-gray-900 bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundURL})`,
      }}
    >
      <div className="rounded-xl bg-gray-800 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8">
        <div className="text-white">
          <div className="mb-8 flex flex-col items-center">
            <img src="./logo.png" className="w-36 h-36" />
            <h1 className="mb-2 text-2xl">Inicia sesión en Invoice Ninja</h1>
          </div>
          <form action="#">
            <div className="mt-8 flex justify-center text-lg text-black">
              <AuthButtonServer />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
