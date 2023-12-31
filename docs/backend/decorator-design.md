# 裝飾者模式

結構型模式，透過將`原對象`放入`包含特殊行為的封裝對象`，來達到將原對象綁定新的行為。
![decorator-1](/public/images/backend/decorator_pattern/decorator-1.png)

## 結構&角色

| 角色 | 定位 |
| :---: | :---: |
| Component 抽象元件 | 宣告`裝飾器`和`被裝飾對象`的共用介面 |
| ConcreteComponent 被裝飾者 | 定義`被裝飾對象`的基本行為(但可以透過裝飾改變內容)|
| Decorator 裝飾器 | 定義`裝飾者`的介面，**並且需指向到`Component`上** |
| ConcreteDecorator 裝飾者 | 定義`裝飾者`的實際行為 |

![decorator-2](/public/images/backend/decorator_pattern/decorator-2.png)

## 範例

::: tip 需求內容
撰寫麥當勞點餐系統，套餐需能夠自由搭配主副餐並自動計算價格
:::

### 未使用裝飾者模式可能架構

![decorator-3](/public/images/backend/decorator_pattern/decorator-3.png)

  - #### 缺點
    - 子類別過多
    - 難以維護

### 使用裝飾者模式的架構

![decorator-4](/public/images/backend/decorator_pattern/decorator-4.png)

#### Component 套餐介面

```java
public interface Combo {
    String getDescribe();
    int getPrice();
    void showInfo();
}
```

#### ConcreteComponent 被裝飾者:主餐

```java
public class BigMac implements Combo {

    private static final String DESCRIBE = "大麥克";
    private static final int PRICE = 100;

    @Override
    public String getDescribe() {
        return DESCRIBE;
    }

    @Override
    public int getPrice() {
        return PRICE;
    }

    @Override
    public void showInfo() {
        System.out.println(getDescribe() + " 套餐 : " + getPrice() + "元");
    }
}
```

#### Decorator 裝飾器:附餐抽象類別

```java
public abstract class ComboDecorator implements Combo {

    protected String describe;
    protected int price;
    protected Combo combo;

    public ComboDecorator(String describe, int price, Combo combo) {
        this.describe = describe;
        this.price = price;
        this.combo = combo;
    }

    @Override
    public String getDescribe() {
        return combo.getDescribe() + " + " + describe;
    }

    @Override
    public int getPrice() {
        return combo.getPrice() + price;
    }

    public void showInfo() {
        System.out.println(getDescribe() + " 套餐 : " + getPrice() + "元");
    }
}
```

#### ConcreteDecorator 裝飾者:附餐項目
```java
public class Fries extends ComboDecorator{

    private static final String FRIES_DESCRIBE = "薯條";
    private static final int FRIES_PRICE = 20;

    public Fries(Combo combo) {
        super(FRIES_DESCRIBE, FRIES_PRICE, combo);
    }

}
```

#### Order 訂單類別
額外加入負責訂單的類別。
```java
public class Order {

    List<Combo> combos = new ArrayList<>();

    public void addCombo(Combo combo) {
        combos.add(combo);
    }

    public void removeCombo(Combo combo) {
        combos.remove(combo);
    }

    public void getOrderInfo() {
        System.out.println("訂單資訊:");
        int total = 0;
        for (int i = 0; i < combos.size(); i++) {
            Combo combo = combos.get(i);
            total += combo.getPrice();
            System.out.println("第" + (i + 1) + "筆:" + combo.getDescribe() + " " + combo.getPrice() + "元");
        }
        System.out.println("共" + total + "元");
    }
}
```

#### 執行
```java
public class McDonaldsApp {
    public static void main(String[] args) {
        /**
         * 大麥克:100 麥香魚:80 薯條:20 雞塊:50
         */
        Combo combo1 = new Fries(new BigMac()); // 大麥克 + 雞塊
        Combo combo2 = new Nugget(new Fries(new BigMac())); // 大麥克 + 雞塊 + 薯條
        Combo combo3 = new Fries(new Fries(new FiletOFish())); // 麥香魚 + 薯條 + 薯條
        combo1.showInfo();
        combo2.showInfo();
        combo3.showInfo();
        System.out.println("==========================");
        /**
         * 合併成訂單
         */
        Order order = new Order();
        order.addCombo(combo1);
        order.addCombo(combo2);
        order.addCombo(combo3);
        order.removeCombo(combo1);
        order.getOrderInfo();
    }
}
```

```執行結果
大麥克 + 薯條 套餐 : 120元
大麥克 + 薯條 + 雞塊 套餐 : 170元
麥香魚 + 薯條 + 薯條 套餐 : 120元
==========================
訂單資訊:
第1筆:大麥克 + 薯條 + 雞塊 170元
第2筆:麥香魚 + 薯條 + 薯條 120元
共290元
```

## 結論
### 優點
- `裝飾類`及`被裝飾類`不會互相耦合。
- 擴充彈性較大。

### 缺點
- 子類別眾多，系統變複雜。

### 使用時機
- 需要在不影響原程式碼的情況下，動態增加職責。
- 不可採用繼承作為擴充手段或若採繼承會造成維護困難時。