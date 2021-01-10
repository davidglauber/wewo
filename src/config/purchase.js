import RNIap, {purchaseUpdatedListener} from 'react-native-iap';

export const purchased = async (productId) => {
    let isPurchased = false;

    try {
        const purchases = await RNIap.getAvailablePurchases();

        purchases.forEach((purchase) =>{
            if(purchase.productId === productId){
                isPurchased = true;
                return;
            } 
        })

      return isPurchased;
    } catch (error) {
        return false;
    }
};

export const requestPurchase = async (productId) => {
    try {
        await RNIap.requestSubscription(productId)
    } catch (error) {
        console.log('Erro ao recuperar dados da assinatura, por favor, tente novamente: ' + error)
    }
};

export const fetchAvailableProducts = async (productsIds) => {
    try {
        const getProducts = await RNIap.getSubscriptions(productsIds)
    } catch (error) {
        console.log('ERRO AO OBTER PRODUTO: ' + error)
    }
};

export const purchaseUpdateSubscription = async () => {
    purchaseUpdatedListener(async (purchase) =>{
        const receipt = purchase.transactionReceipt;

        if(receipt) {
            const ackResult = await RNIap.finishTransaction(purchase);
        }
    });
};