basket = []

def show_basket():
    """Display all items in the basket."""
    if not basket:
        print("Basket is empty!")
    else:
        print(f"Basket contains {len(basket)} items:")
        for i, item in enumerate(basket):
            print(f"  {i + 1}. {item}")




def add_ingredient(item):
    """Add an ingredient to the basket."""
    if item in basket:
        print(f"{item} is already in the basket!")
    else:
        basket.append(item)
        print(f"Added {item} to basket")


def remove_ingredient(item):
    """Remove an ingredient from the basket."""
    if item in basket:
        basket.remove(item)
        print(f"Removed {item} from basket")
    else:
        print(f"{item} is not in the basket!")

        
