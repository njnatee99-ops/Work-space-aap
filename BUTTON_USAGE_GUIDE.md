# คู่มือการใช้งานปุ่ม LiquidButton, MetalButton & LiquidNavbar

เอกสารแนะนำวิธีการใช้งานคอมโพเนนต์ปุ่มสไตล์กระจกน้ำ (Liquid Glass) และปุ่มโลหะ (Metal Button) สำหรับโครงการ NexusLedger

---

## 1. วิธี Import ไปใช้งาน

โครงสร้างโปรเจกต์รองรับมาตรฐาน **shadcn/ui** คุณสามารถเรียกใช้ได้ทั้งผ่าน Path Alias `@/` หรือ Relative Path:

```tsx
import { LiquidButton, MetalButton, Button } from "@/components/ui/liquid-glass-button";
import { LiquidNavbar, NimbusIcons } from "@/components/ui/liquid-glass-navbar";
```

---

## 2. วิธีใช้งาน LiquidButton (ปุ่มกระจกน้ำโปร่งแสง)

`LiquidButton` มาพร้อมฟิลเตอร์กระจกหักเหแสงแบบนุ่มนวล (SVG Refraction Displacement Filter) และเงาสะท้อนหยดน้ำ

### ตัวอย่างการใช้งานพื้นฐาน:
```tsx
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { Sparkles, Send } from "lucide-react";

export function ExamplePage() {
  return (
    <div className="flex gap-4 p-6">
      {/* ขนาดปกติ */}
      <LiquidButton onClick={() => alert("คลิกแล้ว!")}>
        <Sparkles className="w-4 h-4 text-blue-600" />
        <span>สั่งงาน AI</span>
      </LiquidButton>

      {/* ขนาดใหญ่ (lg) สำหรับปุ่มหลักสำคัญ */}
      <LiquidButton size="lg" onClick={() => console.log("Deploy")}>
        <Send className="w-4 h-4 text-blue-600" />
        <span>บันทึกลง Google Drive</span>
      </LiquidButton>

      {/* ขนาดเล็ก (sm) สำหรับปุ่มในตารางหรือการ์ด */}
      <LiquidButton size="sm">
        <span>ทดสอบ Ping</span>
      </LiquidButton>
    </div>
  );
}
```

### Props ที่รองรับใน LiquidButton:
| Prop | ชนิดข้อมูล | ค่าเริ่มต้น | ตัวเลือกที่รองรับ | คำอธิบาย |
| :--- | :--- | :--- | :--- | :--- |
| `size` | string | `"default"` | `"sm"`, `"default"`, `"lg"`, `"xl"`, `"xxl"`, `"icon"` | ปรับขนาดความสูงและ Padding ของปุ่ม |
| `variant` | string | `"default"` | `"default"`, `"outline"`, `"secondary"`, `"destructive"`, `"ghost"`, `"link"` | ปรับโทนสีและสไตล์ของปุ่ม |
| `disabled` | boolean | `false` | `true`, `false` | ปิดการใช้งานปุ่มพร้อมปรับความโปร่งแสง |
| `onClick` | function | - | Event Handler | ฟังก์ชันทำงานเมื่อแตะหรือคลิก |
| `className` | string | - | Tailwind Classes | คลาสสไตล์เพิ่มเติม |

---

## 3. วิธีใช้งาน MetalButton (ปุ่มโลหะนูนมีแสงเงา)

`MetalButton` เหมาะสำหรับปุ่มแอ็กชันที่มีความสำคัญสูง มีเอฟเฟกต์แสงเงากดลง (Press & Shine Effect)

### ตัวอย่างการใช้งาน:
```tsx
import { MetalButton } from "@/components/ui/liquid-glass-button";

export function MetalButtonDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      {/* สีน้ำเงินมาตรฐานระบบ */}
      <MetalButton variant="primary">
        บันทึกข้อมูลสัญญา
      </MetalButton>

      {/* สีทองพรีเมียม */}
      <MetalButton variant="gold">
        อนุมัติขอบเขตงาน
      </MetalButton>

      {/* สีเขียวสำเร็จ */}
      <MetalButton variant="success">
        ผ่านการตรวจ 16 ด่าน
      </MetalButton>
    </div>
  );
}
```

### Variant สีของ MetalButton:
- `"default"`: โลหะสีเทาเงินคลาสสิก
- `"primary"`: สีน้ำเงิน Nexus Blue หรูหรา
- `"success"`: สีเขียวมรกตสำหรับด่านที่ผ่าน
- `"gold"`: สีทองแชมเปญสำหรับมติอนุมัติ
- `"error"`: สีแดงทับทิมสำหรับยกเลิก
- `"bronze"`: สีทองแดงอบอุ่น

---

## 4. วิธีใช้งาน LiquidNavbar (แถบนำทางผิวน้ำ Waterline)

`LiquidNavbar` เป็นแถบนำทางนวัตกรรมจาก Nimbus UI มี WebGL Shader คำนวณระลอกคลื่นน้ำแบบไดนามิก

```tsx
import { LiquidNavbar, NimbusIcons } from "@/components/ui/liquid-glass-navbar";
import { useState } from "react";

export function NavigationBar() {
  const [active, setActive] = useState(0);

  const items = [
    { label: "หน้าหลัก", icon: NimbusIcons.home, fx: "glow" },
    { label: "ขอบเขตงาน", icon: NimbusIcons.globe, fx: "spin" },
    { label: "สั่ง AI", icon: NimbusIcons.plane, fx: "plane" },
    { label: "ตรวจ 16 ด่าน", icon: NimbusIcons.drop, fx: "drop" },
    { label: "ตั้งค่า", icon: NimbusIcons.user, fx: "wave" },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-xl border-t border-blue-200/60 py-2.5 flex justify-center">
      <LiquidNavbar
        items={items}
        active={active}
        onChange={(index) => setActive(index)}
        tone="light" // "light" สำหรับพื้นหลังสีฟ้า/ขาว, "dark" สำหรับโหมดกลางคืน
        compact={true} // true เพื่อแสดงเฉพาะไอคอนหรูหราไม่ทับตัวหนังสือ
        sound={true} // เล่นเสียงหยดน้ำเบาๆ (Soft Plip Sound)
      />
    </nav>
  );
}
```

---

## 5. วิธีนำโปรเจกต์ออกไปรันภายนอก (Export & Run)

### ติดตั้งและรันในเครื่อง (Local Machine):
1. ตรวจสอบว่าเครื่องมี **Node.js 18+** หรือ **Node.js 20+**
2. รันคำสั่งติดตั้ง dependencies:
   ```bash
   npm install
   ```
3. รัน Development Server (Port 3000):
   ```bash
   npm run dev
   ```
4. หรือ Build สำหรับขึ้น Production:
   ```bash
   npm run build
   npm start
   ```

โปรเจกต์จะเชื่อมต่อกับ **Google Apps Script Web App** และ Google Drive Folder `1RvGehvlDrPTaR9JvQgCcFPqiQbRE8_yn` ให้โดยอัตโนมัติ 100%
