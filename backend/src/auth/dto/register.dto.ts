export class RegisterDto {
  username!: string;
  password!: string;
  confirmPassword!: string;
  area!: "China" | "America" | "Indonesia";
}